(function (global) {
    'use strict';

    function number(value, fallback) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : (fallback == null ? 0 : fallback);
    }

    function parseDateKey(value) {
        if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12, 0, 0);
        const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!match) return new Date(value);
        return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0);
    }

    function getISOWeekNumber(dateValue) {
        const date = parseDateKey(dateValue);
        const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const day = target.getUTCDay() || 7;
        target.setUTCDate(target.getUTCDate() + 4 - day);
        const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
        return Math.ceil((((target - yearStart) / 86400000) + 1) / 7);
    }

    function extractChangeoverCountFromNotes(note) {
        const regex = /(?:\[PRZEZBROJENIA:(\d+)\]|<!--\s*PRZEZBROJENIA:(\d+)\s*-->)/gi;
        let match, total = 0, found = false;
        while ((match = regex.exec(String(note || ''))) !== null) {
            const value = parseInt(match[1] || match[2], 10);
            if (!Number.isNaN(value) && value >= 0) { total += value; found = true; }
        }
        return found ? total : null;
    }

    function stripChangeoverMarker(note) {
        return String(note || '')
            .replace(/\s*\[PRZEZBROJENIA:\d+\]\s*/gi, ' ')
            .replace(/\s*<!--\s*PRZEZBROJENIA:\d+\s*-->\s*/gi, ' ')
            .replace(/\s{2,}/g, ' ').trim();
    }

    function getChangeoverCount(record) {
        const rec = record || {};
        const direct = rec.changeoverCount != null ? rec.changeoverCount :
            (rec.changeover_count != null ? rec.changeover_count : rec.changeovers);
        const parsed = parseInt(direct, 10);
        if (!Number.isNaN(parsed) && parsed >= 0) return parsed;
        const notes = extractChangeoverCountFromNotes(rec.notes || '');
        if (notes !== null) return notes;
        return number(rec.cleaning, 0) > 0 ? 1 : 0;
    }

    function aggregateShiftRows(rows) {
        const grouped = {};
        (rows || []).forEach(function (row) {
            const key = row && row.date;
            if (!key) return;
            if (!grouped[key]) {
                grouped[key] = Object.assign({}, row, {
                    meters: 0, pieces: 0, bad: 0, breakdown: 0, downtime_minutes: 0,
                    cleaning: 0, service: 0, notes: '', _shifts: [],
                    _plannedMinutes: 0, _runtimeMinutes: 0, _idealMinutes: 0,
                    _goodPieces: 0, _totalPieces: 0, _oeeSum: 0, _oeeCount: 0
                });
            }
            const g = grouped[key];
            const shift = number(row.shift, 1);
            if (!g._shifts.includes(shift)) g._shifts.push(shift);
            ['meters','pieces','bad','breakdown','downtime_minutes','cleaning','service'].forEach(function (field) {
                g[field] += number(row[field], 0);
            });
            if (shift === 1 || g.m_start == null) g.m_start = row.m_start;
            if (shift === 1 || g.pcs_start == null) g.pcs_start = row.pcs_start;
            if (shift === 2 || g.m_end == null) g.m_end = row.m_end;
            if (shift === 2 || g.pcs_end == null) g.pcs_end = row.pcs_end;
            if (row.h_start && (!g.h_start || shift === 1)) g.h_start = row.h_start;
            if (row.h_end && (!g.h_end || shift === 2)) g.h_end = row.h_end;

            const av = Math.max(0, number(row.av, 0)) / 100;
            const perf = Math.max(0, number(row.perf, 0)) / 100;
            const qual = Math.max(0, number(row.qual, 0)) / 100;
            const shiftOee = Number(row.oee);
            if (Number.isFinite(shiftOee) && shiftOee >= 0) {
                g._oeeSum += shiftOee;
                g._oeeCount += 1;
                if (shift === 1 || shift === 2) g['shift_oee_' + shift] = shiftOee;
            }
            const downtime = Math.max(0, number(row.downtime_minutes != null ? row.downtime_minutes : row.breakdown, 0))
                + Math.max(0, number(row.cleaning, 0)) + Math.max(0, number(row.service, 0));
            let planned = 480;
            let runtime = av > 0 && av < 1 && downtime > 0 ? (av * downtime / (1 - av)) : (av * planned);
            if (av > 0 && av < 1 && downtime > 0) planned = runtime + downtime;
            g._plannedMinutes += planned;
            g._runtimeMinutes += runtime;
            g._idealMinutes += runtime * perf;
            const totalPieces = Math.max(0, number(row.pieces, 0));
            g._totalPieces += totalPieces;
            g._goodPieces += totalPieces * qual;
            if (row.notes) g.notes += (g.notes ? ' | ' : '') + '[Zmiana ' + shift + '] ' + row.notes;
            if (!g.created_at || String(row.created_at || '') > String(g.created_at)) g.created_at = row.created_at;
        });
        return Object.keys(grouped).sort().map(function (key) {
            const g = grouped[key];
            g.shift_count = g._shifts.length;
            g.shifts_present = g._shifts.slice().sort().join(',');
            g.av = g._plannedMinutes > 0 ? (g._runtimeMinutes / g._plannedMinutes) * 100 : 0;
            g.perf = g._runtimeMinutes > 0 ? (g._idealMinutes / g._runtimeMinutes) * 100 : 0;
            g.qual = g._totalPieces > 0 ? (g._goodPieces / g._totalPieces) * 100 : 100;
            g.oee = g._oeeCount > 0 ? g._oeeSum / g._oeeCount : 0;
            ['_shifts','_plannedMinutes','_runtimeMinutes','_idealMinutes','_goodPieces','_totalPieces','_oeeSum','_oeeCount'].forEach(k => delete g[k]);
            return g;
        });
    }

    function periodAverage(database, predicate) {
        let sum = 0, count = 0;
        Object.keys(database || {}).forEach(function (key) {
            const date = parseDateKey(key);
            if (!predicate(date, key, database[key])) return;
            const value = Number(database[key] && database[key].oee);
            if (Number.isFinite(value) && value >= 0) { sum += value; count += 1; }
        });
        return count ? { value: sum / count, count: count } : { value: null, count: 0 };
    }

    function weekAverage(database, weekNum, weekYear) {
        const year = Number(weekYear);
        return periodAverage(database, date => date.getFullYear() === year && getISOWeekNumber(date) === Number(weekNum) && date.getDay() !== 0 && date.getDay() !== 6);
    }

    function monthAverage(database, year, month) {
        return periodAverage(database, date => date.getFullYear() === Number(year) && date.getMonth() === Number(month));
    }

    function calculateOEE(availability, performance, quality) {
        return number(availability, 0) * number(performance, 0) * number(quality, 0) / 10000;
    }

    global.OEECore = Object.freeze({
        version: '2.0.0', number, parseDateKey, getISOWeekNumber,
        extractChangeoverCountFromNotes, stripChangeoverMarker, getChangeoverCount,
        aggregateShiftRows, periodAverage, weekAverage, monthAverage, calculateOEE
    });
})(typeof window !== 'undefined' ? window : globalThis);
