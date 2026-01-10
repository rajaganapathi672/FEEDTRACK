// @ts-ignore
import { jsPDF } from 'jspdf';
// @ts-ignore
import autoTable from 'jspdf-autotable';
import { Feedback } from '../types';

export const generateCSV = (feedbacks: Feedback[]) => {
    if (!feedbacks.length) return;

    const headers = ['Timestamp', 'Category Group', 'Category Type', 'Sentiment', 'Confidence', 'Feedback Text', 'Analysis Summary'];
    const rows = feedbacks.map(f => [
        new Date(f.timestamp).toLocaleString(),
        f.categoryGroup || 'N/A',
        f.categoryType || 'N/A',
        f.analysis?.sentiment || 'Pending',
        (f.analysis?.confidence || 0) + '%',
        `"${f.text.replace(/"/g, '""')}"`, // Escape quotes
        `"${(f.analysis?.summary || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `feedtrack_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const generatePDF = (feedbacks: Feedback[]) => {
    if (!feedbacks.length) return;

    // @ts-ignore
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    // @ts-ignore
    doc.setTextColor(40, 40, 40);
    doc.text('FeedTrack Analytics Report', 14, 22);

    doc.setFontSize(10);
    // @ts-ignore
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Total Records: ${feedbacks.length}`, 14, 33);

    // Summary Logic
    const sentimentCounts = feedbacks.reduce((acc, curr) => {
        const s = curr.analysis?.sentiment || 'Pending';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const summaryText = Object.entries(sentimentCounts)
        .map(([key, val]) => `${key}: ${val}`)
        .join('  |  ');

    doc.text(`Sentiment Breakdown: ${summaryText}`, 14, 38);

    // Table
    const tableRows = feedbacks.map(f => [
        new Date(f.timestamp).toLocaleDateString(),
        f.categoryGroup || '-',
        f.analysis?.sentiment || 'Pend.',
        f.analysis?.summary || f.text.substring(0, 50) + '...'
    ]);

    // @ts-ignore
    autoTable(doc, {
        head: [['Date', 'Category', 'Sentiment', 'Summary']],
        body: tableRows,
        startY: 45,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 66, 66] },
    });

    doc.save(`feedtrack_summary_${new Date().toISOString().split('T')[0]}.pdf`);
};
