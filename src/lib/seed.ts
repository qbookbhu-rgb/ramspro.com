
import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from './firebase-admin'; // Using admin SDK

const labReports = [
    {
        name: 'Complete Blood Count',
        date: new Date('2023-10-15T10:00:00Z'),
        labName: 'City Diagnostics',
        patientId: 'FfEa5qSgVSTty2e5n8VvORpSjFp1', // Replace with an actual patient UID from your test data
        fileUrl: 'https://example.com/report1.pdf'
    },
    {
        name: 'Lipid Profile',
        date: new Date('2023-10-15T10:00:00Z'),
        labName: 'City Diagnostics',
        patientId: 'FfEa5qSgVSTty2e5n8VvORpSjFp1', // Replace with an actual patient UID
        fileUrl: 'https://example.com/report2.pdf'
    },
     {
        name: 'Thyroid Function Test',
        date: new Date('2023-11-02T14:30:00Z'),
        labName: 'Advanced Labs',
        patientId: 'GgHg6rThWSTuy3f6o9WwPSqRkGp2', // Replace with another patient UID
        fileUrl: 'https://example.com/report3.pdf'
    }
];

async function seedDatabase() {
    const batch = writeBatch(db);
    const labReportsCollection = collection(db, 'labreports');

    console.log('Seeding lab reports...');
    labReports.forEach((report) => {
        const docRef = doc(labReportsCollection); // Firestore will auto-generate an ID
        batch.set(docRef, report);
    });

    try {
        await batch.commit();
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

// You can run this script via a command like `npx ts-node src/lib/seed.ts`
// Make sure you have ts-node installed (`npm install -g ts-node`)
// and your firebase-admin credentials are set up correctly in your environment.
seedDatabase();
