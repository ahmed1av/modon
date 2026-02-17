/**
 * PDF Brochure Generator - MODON Development Platform
 * ====================================================
 * Premium property brochure generation using jsPDF
 * Client-side generation for instant downloads
 */

import { jsPDF } from 'jspdf';

interface PropertyBrochureData {
    title: string;
    price: string;
    location: string;
    city: string;
    country: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    type: string;
    referenceCode: string;
    description?: string;
    imageUrl?: string;
}

/**
 * Generates a premium PDF brochure for a property
 * 
 * @param property - Property data to include in the brochure
 * @returns Promise that resolves when PDF generation is complete
 */
export async function generatePropertyBrochure(property: PropertyBrochureData): Promise<void> {
    // Create new PDF document (A4 portrait)
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // ============================================
    // COLORS (MODON Premium Palette)
    // ============================================
    const colors = {
        gold: [212, 175, 55] as [number, number, number], // #d4af37
        charcoal: [51, 51, 51] as [number, number, number], // #333333
        darkGray: [102, 102, 102] as [number, number, number], // #666666
        lightGray: [240, 240, 240] as [number, number, number], // #f0f0f0
        white: [255, 255, 255] as [number, number, number],
    };

    // ============================================
    // HEADER - Gold Bar with Logo
    // ============================================
    doc.setFillColor(...colors.gold);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // MODON Logo/Title (Centered)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(...colors.white);
    doc.text('MODON', pageWidth / 2, 18, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('EVOLUTIO', pageWidth / 2, 26, { align: 'center' });

    doc.setFontSize(8);
    doc.text('LUXURY REAL ESTATE', pageWidth / 2, 33, { align: 'center' });

    let yPosition = 55;

    // ============================================
    // PROPERTY IMAGE (if available)
    // ============================================
    if (property.imageUrl) {
        try {
            // Note: In production, you'd need to load the image via CORS-friendly proxy
            // For now, we'll create a placeholder box
            doc.setFillColor(...colors.lightGray);
            doc.rect(margin, yPosition, pageWidth - 2 * margin, 100, 'F');

            // Image placeholder text
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.setTextColor(...colors.darkGray);
            doc.text('Property Image', pageWidth / 2, yPosition + 50, { align: 'center' });

            yPosition += 110;
        } catch (error) {
            console.warn('Could not load property image:', error);
            yPosition += 10;
        }
    }

    // ============================================
    // PROPERTY TITLE
    // ============================================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...colors.charcoal);

    // Word wrap for long titles
    const titleLines = doc.splitTextToSize(property.title, pageWidth - 2 * margin);
    doc.text(titleLines, margin, yPosition);
    yPosition += titleLines.length * 8 + 5;

    // ============================================
    // LOCATION
    // ============================================
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(...colors.darkGray);
    doc.text(`${property.city}, ${property.country}`, margin, yPosition);
    yPosition += 10;

    // Divider Line
    doc.setDrawColor(...colors.gold);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // ============================================
    // PRICE (Prominent)
    // ============================================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(...colors.gold);
    doc.text(property.price, margin, yPosition);
    yPosition += 15;

    // ============================================
    // PROPERTY SPECS (Grid Layout)
    // ============================================
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(...colors.charcoal);

    const specs = [
        { label: 'Property Type', value: property.type },
        { label: 'Bedrooms', value: property.bedrooms.toString() },
        { label: 'Bathrooms', value: property.bathrooms.toString() },
        { label: 'Living Area', value: `${property.area} m²` },
        { label: 'Reference Code', value: property.referenceCode },
    ];

    // Create a 2-column grid for specs
    const colWidth = (pageWidth - 2 * margin - 10) / 2;
    let specY = yPosition;

    specs.forEach((spec, index) => {
        const col = index % 2;
        const xPos = margin + col * (colWidth + 10);

        if (index > 0 && index % 2 === 0) {
            specY += 12;
        }

        // Label
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...colors.darkGray);
        doc.text(spec.label.toUpperCase(), xPos, specY);

        // Value
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(...colors.charcoal);
        doc.text(spec.value, xPos, specY + 5);
    });

    yPosition = specY + 15;

    // ============================================
    // DESCRIPTION (if available)
    // ============================================
    if (property.description && yPosition < pageHeight - 80) {
        // Divider
        doc.setDrawColor(...colors.lightGray);
        doc.setLineWidth(0.3);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(...colors.charcoal);
        doc.text('PROPERTY DESCRIPTION', margin, yPosition);
        yPosition += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...colors.darkGray);

        // Truncate description if too long
        const maxDescLength = 500;
        const shortDesc = property.description.length > maxDescLength
            ? property.description.substring(0, maxDescLength) + '...'
            : property.description;

        const descLines = doc.splitTextToSize(shortDesc, pageWidth - 2 * margin);
        const maxLines = Math.floor((pageHeight - yPosition - 60) / 5);
        const displayLines = descLines.slice(0, maxLines);

        doc.text(displayLines, margin, yPosition);
        yPosition += displayLines.length * 5 + 10;
    }

    // ============================================
    // FOOTER - Contact & Branding
    // ============================================
    const footerY = pageHeight - 40;

    // Footer background
    doc.setFillColor(...colors.charcoal);
    doc.rect(0, footerY, pageWidth, 40, 'F');

    // Contact info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...colors.white);

    const contactInfo = [
        'MODON EVOLUTIO - Premium Real Estate',
        'Email: info@modon.com | Phone: +20 100 123 4567',
        'www.modon.com',
    ];

    contactInfo.forEach((line, index) => {
        doc.text(line, pageWidth / 2, footerY + 10 + index * 5, { align: 'center' });
    });

    // Gold accent line
    doc.setDrawColor(...colors.gold);
    doc.setLineWidth(1);
    doc.line(margin, footerY + 28, pageWidth - margin, footerY + 28);

    // Legal disclaimer
    doc.setFontSize(7);
    doc.setTextColor(200, 200, 200);
    doc.text(
        'This brochure is for informational purposes only. Specifications are subject to change.',
        pageWidth / 2,
        footerY + 35,
        { align: 'center' }
    );

    // ============================================
    // SAVE PDF
    // ============================================
    const fileName = `${property.referenceCode}_${property.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(fileName);
}

/**
 * Client-side utility to trigger PDF download
 * Call this from a button onClick handler
 */
export function downloadPropertyBrochure(property: PropertyBrochureData): void {
    try {
        generatePropertyBrochure(property);
    } catch (error) {
        console.error('Failed to generate PDF brochure:', error);
        alert('Failed to generate brochure. Please try again.');
    }
}
