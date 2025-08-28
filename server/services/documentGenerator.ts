import fs from 'fs';
import path from 'path';

// FreeDoc branding and header for documents
const FREEDOC_HEADER = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>FreeDoc Medical Document</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px;
            background: white;
        }
        .header {
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .logo {
            display: flex;
            align-items: center;
        }
        .logo-text {
            font-size: 32px;
            font-weight: bold;
            color: #2563eb;
            margin-left: 10px;
        }
        .logo-icon {
            width: 50px;
            height: 50px;
            background: #2563eb;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 20px;
        }
        .contact-info {
            text-align: right;
            color: #6b7280;
            font-size: 14px;
        }
        .document-title {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
        }
        .section {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }
        .section h3 {
            margin-top: 0;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 8px;
        }
        .field {
            margin: 10px 0;
        }
        .field label {
            font-weight: bold;
            color: #374151;
            display: inline-block;
            width: 150px;
        }
        .field span {
            color: #1f2937;
        }
        .signature-section {
            margin-top: 40px;
            border-top: 2px solid #e5e7eb;
            padding-top: 20px;
        }
        .signature-box {
            border: 1px solid #d1d5db;
            height: 80px;
            margin: 10px 0;
            padding: 10px;
            background: #f9fafb;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
        }
        .modification-log {
            margin-top: 30px;
            padding: 15px;
            background: #f3f4f6;
            border-radius: 8px;
            border: 1px solid #d1d5db;
        }
        .editable {
            border: 1px dashed #9ca3af;
            padding: 8px;
            background: #fffbeb;
            min-height: 20px;
            cursor: text;
        }
        @media print {
            .header { page-break-inside: avoid; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            <div class="logo-icon">F</div>
            <div class="logo-text">freedoc</div>
        </div>
        <div class="contact-info">
            <strong>Free Healthcare for All Australians</strong><br>
            Email: support@freedoc.com.au<br>
            Website: www.freedoc.com.au<br>
            ABN: 12 345 678 901
        </div>
    </div>
`;

const FREEDOC_FOOTER = `
    <div class="footer">
        <p><strong>FreeDoc</strong> - Providing free healthcare services to all Australians</p>
        <p>This document was generated electronically and is valid without signature.</p>
        <p>For verification, please contact FreeDoc at support@freedoc.com.au</p>
    </div>
</body>
</html>
`;

export interface DocumentGenerationData {
  patientName: string;
  patientDOB: string;
  patientAddress?: string;
  doctorName: string;
  doctorNumber: string;
  consultationId: string;
  generatedDate: string;
}

export interface MedicalCertificateData extends DocumentGenerationData {
  certificateType: string;
  dateFrom: string;
  dateTo: string;
  condition: string;
  workCapacity: string;
  additionalNotes?: string;
}

export interface PrescriptionData extends DocumentGenerationData {
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    quantity: string;
    repeats: number;
  }>;
  diagnosis: string;
  additionalInstructions?: string;
}

export interface PathologyReferralData extends DocumentGenerationData {
  testsRequested: string[];
  clinicalDetails: string;
  urgency: 'routine' | 'urgent' | 'asap';
  preferredLab?: string;
  additionalNotes?: string;
}

export class DocumentGenerator {
  
  static generateMedicalCertificate(data: MedicalCertificateData): string {
    const modificationLog = `
    <div class="modification-log">
        <h3>Document Modification Log</h3>
        <p><strong>Original Issue:</strong> ${data.generatedDate} by ${data.doctorName}</p>
        <div class="editable" contenteditable="true" placeholder="Add modification notes here...">
            Click here to add modification notes...
        </div>
    </div>`;

    return `${FREEDOC_HEADER}
    <div class="document-title">MEDICAL CERTIFICATE</div>
    
    <div class="section">
        <h3>Patient Information</h3>
        <div class="field"><label>Full Name:</label> <span class="editable" contenteditable="true">${data.patientName}</span></div>
        <div class="field"><label>Date of Birth:</label> <span class="editable" contenteditable="true">${data.patientDOB}</span></div>
        <div class="field"><label>Address:</label> <span class="editable" contenteditable="true">${data.patientAddress || 'Not provided'}</span></div>
    </div>

    <div class="section">
        <h3>Medical Certification</h3>
        <div class="field"><label>Certificate Type:</label> <span class="editable" contenteditable="true">${data.certificateType}</span></div>
        <div class="field"><label>Valid From:</label> <span class="editable" contenteditable="true">${data.dateFrom}</span></div>
        <div class="field"><label>Valid To:</label> <span class="editable" contenteditable="true">${data.dateTo}</span></div>
        <div class="field"><label>Medical Condition:</label> <span class="editable" contenteditable="true">${data.condition}</span></div>
        <div class="field"><label>Work Capacity:</label> <span class="editable" contenteditable="true">${data.workCapacity}</span></div>
    </div>

    ${data.additionalNotes ? `
    <div class="section">
        <h3>Additional Notes</h3>
        <div class="editable" contenteditable="true">${data.additionalNotes}</div>
    </div>` : ''}

    <div class="signature-section">
        <div class="field"><label>Attending Doctor:</label> <span>${data.doctorName}</span></div>
        <div class="field"><label>Medical Registration:</label> <span>${data.doctorNumber}</span></div>
        <div class="field"><label>Date Issued:</label> <span>${data.generatedDate}</span></div>
        <div class="signature-box">
            <strong>Digital Signature:</strong><br>
            This document has been digitally signed and verified by FreeDoc
        </div>
    </div>

    ${modificationLog}
    ${FREEDOC_FOOTER}`;
  }

  static generatePrescription(data: PrescriptionData): string {
    const medicationsList = data.medications.map(med => `
        <tr>
            <td class="editable" contenteditable="true">${med.name}</td>
            <td class="editable" contenteditable="true">${med.dosage}</td>
            <td class="editable" contenteditable="true">${med.frequency}</td>
            <td class="editable" contenteditable="true">${med.quantity}</td>
            <td class="editable" contenteditable="true">${med.repeats}</td>
        </tr>
    `).join('');

    const modificationLog = `
    <div class="modification-log">
        <h3>Prescription Modification Log</h3>
        <p><strong>Original Issue:</strong> ${data.generatedDate} by ${data.doctorName}</p>
        <div class="editable" contenteditable="true" placeholder="Add modification notes here...">
            Click here to add modification notes...
        </div>
    </div>`;

    return `${FREEDOC_HEADER}
    <style>
        .prescription-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .prescription-table th, .prescription-table td { 
            border: 1px solid #d1d5db; 
            padding: 12px; 
            text-align: left; 
        }
        .prescription-table th { background: #f3f4f6; font-weight: bold; }
    </style>
    
    <div class="document-title">PRESCRIPTION</div>
    
    <div class="section">
        <h3>Patient Information</h3>
        <div class="field"><label>Full Name:</label> <span class="editable" contenteditable="true">${data.patientName}</span></div>
        <div class="field"><label>Date of Birth:</label> <span class="editable" contenteditable="true">${data.patientDOB}</span></div>
        <div class="field"><label>Address:</label> <span class="editable" contenteditable="true">${data.patientAddress || 'Not provided'}</span></div>
    </div>

    <div class="section">
        <h3>Prescribed Medications</h3>
        <table class="prescription-table">
            <thead>
                <tr>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                    <th>Quantity</th>
                    <th>Repeats</th>
                </tr>
            </thead>
            <tbody>
                ${medicationsList}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h3>Clinical Information</h3>
        <div class="field"><label>Diagnosis:</label> <span class="editable" contenteditable="true">${data.diagnosis}</span></div>
        ${data.additionalInstructions ? `<div class="field"><label>Instructions:</label> <div class="editable" contenteditable="true">${data.additionalInstructions}</div></div>` : ''}
    </div>

    <div class="signature-section">
        <div class="field"><label>Prescribing Doctor:</label> <span>${data.doctorName}</span></div>
        <div class="field"><label>Medical Registration:</label> <span>${data.doctorNumber}</span></div>
        <div class="field"><label>Date Issued:</label> <span>${data.generatedDate}</span></div>
        <div class="signature-box">
            <strong>Digital Signature:</strong><br>
            This prescription has been digitally signed and verified by FreeDoc
        </div>
    </div>

    ${modificationLog}
    ${FREEDOC_FOOTER}`;
  }

  static generatePathologyReferral(data: PathologyReferralData): string {
    const testsList = data.testsRequested.map(test => `<li class="editable" contenteditable="true">${test}</li>`).join('');
    
    const modificationLog = `
    <div class="modification-log">
        <h3>Referral Modification Log</h3>
        <p><strong>Original Issue:</strong> ${data.generatedDate} by ${data.doctorName}</p>
        <div class="editable" contenteditable="true" placeholder="Add modification notes here...">
            Click here to add modification notes...
        </div>
    </div>`;

    return `${FREEDOC_HEADER}
    <div class="document-title">PATHOLOGY REFERRAL</div>
    
    <div class="section">
        <h3>Patient Information</h3>
        <div class="field"><label>Full Name:</label> <span class="editable" contenteditable="true">${data.patientName}</span></div>
        <div class="field"><label>Date of Birth:</label> <span class="editable" contenteditable="true">${data.patientDOB}</span></div>
        <div class="field"><label>Address:</label> <span class="editable" contenteditable="true">${data.patientAddress || 'Not provided'}</span></div>
    </div>

    <div class="section">
        <h3>Tests Requested</h3>
        <ul style="margin: 10px 0; padding-left: 20px;">
            ${testsList}
        </ul>
        <div class="field"><label>Urgency:</label> <span class="editable" contenteditable="true">${data.urgency.toUpperCase()}</span></div>
        ${data.preferredLab ? `<div class="field"><label>Preferred Laboratory:</label> <span class="editable" contenteditable="true">${data.preferredLab}</span></div>` : ''}
    </div>

    <div class="section">
        <h3>Clinical Details</h3>
        <div class="editable" contenteditable="true" style="min-height: 100px; padding: 15px; border: 1px solid #d1d5db; border-radius: 4px;">
            ${data.clinicalDetails}
        </div>
    </div>

    ${data.additionalNotes ? `
    <div class="section">
        <h3>Additional Notes</h3>
        <div class="editable" contenteditable="true">${data.additionalNotes}</div>
    </div>` : ''}

    <div class="signature-section">
        <div class="field"><label>Referring Doctor:</label> <span>${data.doctorName}</span></div>
        <div class="field"><label>Medical Registration:</label> <span>${data.doctorNumber}</span></div>
        <div class="field"><label>Date Issued:</label> <span>${data.generatedDate}</span></div>
        <div class="signature-box">
            <strong>Digital Signature:</strong><br>
            This referral has been digitally signed and verified by FreeDoc
        </div>
    </div>

    ${modificationLog}
    ${FREEDOC_FOOTER}`;
  }

  static saveDocument(html: string, fileName: string): string {
    const documentsDir = path.join(process.cwd(), 'generated_documents');
    if (!fs.existsSync(documentsDir)) {
      fs.mkdirSync(documentsDir, { recursive: true });
    }
    
    const filePath = path.join(documentsDir, fileName);
    fs.writeFileSync(filePath, html);
    return filePath;
  }
}