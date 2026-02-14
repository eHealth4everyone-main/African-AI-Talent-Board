import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed database with African AI Talent and Job postings
 */
async function main() {
    console.log('🌱 Starting database seed...\n');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.job.deleteMany();
    await prisma.talent.deleteMany();
    console.log('✅ Data cleared\n');

    // ============================================
    // Seed Talents - African AI Professionals
    // ============================================
    console.log('👥 Creating talent profiles...');

    const talents = await Promise.all([
        // 1. Senior AI Engineer from Nigeria
        prisma.talent.create({
            data: {
                name: 'Amara Okafor',
                email: 'amara.okafor@aimail.com',
                skills: JSON.stringify(['Python', 'TensorFlow', 'NLP', 'Deep Learning', 'PyTorch', 'Computer Vision']),
                hourlyRate: 85,
                experienceLevel: 'SENIOR',
                availability: true,
            },
        }),

        // 2. Mid-level ML Engineer from Kenya
        prisma.talent.create({
            data: {
                name: 'Kwame Mensah',
                email: 'kwame.mensah@mltech.com',
                skills: JSON.stringify(['Python', 'Scikit-learn', 'Data Analysis', 'TensorFlow', 'Machine Learning']),
                hourlyRate: 60,
                experienceLevel: 'MID',
                availability: true,
            },
        }),

        // 3. Senior Data Scientist from South Africa
        prisma.talent.create({
            data: {
                name: 'Thandi Ndlovu',
                email: 'thandi.ndlovu@datasci.com',
                skills: JSON.stringify(['Python', 'R', 'Statistical Modeling', 'Deep Learning', 'PyTorch', 'NLP']),
                hourlyRate: 95,
                experienceLevel: 'SENIOR',
                availability: true,
            },
        }),

        // 4. Junior AI Developer from Ghana
        prisma.talent.create({
            data: {
                name: 'Kofi Asante',
                email: 'kofi.asante@aidev.com',
                skills: JSON.stringify(['Python', 'Machine Learning', 'TensorFlow', 'Data Preprocessing']),
                hourlyRate: 35,
                experienceLevel: 'JUNIOR',
                availability: true,
            },
        }),

        // 5. Mid-level Computer Vision Specialist from Egypt
        prisma.talent.create({
            data: {
                name: 'Fatima Hassan',
                email: 'fatima.hassan@vision.ai',
                skills: JSON.stringify(['Python', 'OpenCV', 'Computer Vision', 'TensorFlow', 'Image Processing']),
                hourlyRate: 70,
                experienceLevel: 'MID',
                availability: true,
            },
        }),

        // 6. Senior NLP Engineer from Morocco
        prisma.talent.create({
            data: {
                name: 'Youssef Benali',
                email: 'youssef.benali@nlptech.com',
                skills: JSON.stringify(['Python', 'NLP', 'Transformers', 'BERT', 'PyTorch', 'Hugging Face']),
                hourlyRate: 90,
                experienceLevel: 'SENIOR',
                availability: true,
            },
        }),

        // 7. Mid-level Data Engineer from Tanzania
        prisma.talent.create({
            data: {
                name: 'Nia Mwangi',
                email: 'nia.mwangi@dataeng.com',
                skills: JSON.stringify(['Python', 'SQL', 'Data Pipelines', 'Apache Spark', 'Machine Learning']),
                hourlyRate: 55,
                experienceLevel: 'MID',
                availability: false, // Not available
            },
        }),

        // 8. Senior AI Researcher from Ethiopia
        prisma.talent.create({
            data: {
                name: 'Dawit Tesfaye',
                email: 'dawit.tesfaye@airesearch.com',
                skills: JSON.stringify(['Python', 'Deep Learning', 'Research', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision']),
                hourlyRate: 100,
                experienceLevel: 'SENIOR',
                availability: true,
            },
        }),

        // 9. Junior ML Engineer from Uganda
        prisma.talent.create({
            data: {
                name: 'Aisha Nakato',
                email: 'aisha.nakato@mlstart.com',
                skills: JSON.stringify(['Python', 'Scikit-learn', 'Data Analysis', 'Machine Learning']),
                hourlyRate: 30,
                experienceLevel: 'JUNIOR',
                availability: true,
            },
        }),

        // 10. Mid-level AI Developer from Senegal
        prisma.talent.create({
            data: {
                name: 'Moussa Diop',
                email: 'moussa.diop@aidev.africa',
                skills: JSON.stringify(['Python', 'TensorFlow', 'Machine Learning', 'Django', 'API Development']),
                hourlyRate: 65,
                experienceLevel: 'MID',
                availability: true,
            },
        }),

        // 11. Senior ML Architect from Rwanda
        prisma.talent.create({
            data: {
                name: 'Grace Uwase',
                email: 'grace.uwase@mlarch.com',
                skills: JSON.stringify(['Python', 'AWS', 'MLOps', 'TensorFlow', 'PyTorch', 'Kubernetes', 'Deep Learning']),
                hourlyRate: 110,
                experienceLevel: 'SENIOR',
                availability: true,
            },
        }),

        // 12. Junior Data Analyst from Zimbabwe
        prisma.talent.create({
            data: {
                name: 'Tendai Moyo',
                email: 'tendai.moyo@datawork.com',
                skills: JSON.stringify(['Python', 'Data Visualization', 'Pandas', 'Data Analysis']),
                hourlyRate: 28,
                experienceLevel: 'JUNIOR',
                availability: true,
            },
        }),
    ]);

    console.log(`✅ Created ${talents.length} talent profiles\n`);

    // ============================================
    // Seed Jobs - AI/ML Project Postings
    // ============================================
    console.log('💼 Creating job postings...');

    const jobs = await Promise.all([
        // 1. Senior NLP Project
        prisma.job.create({
            data: {
                title: 'Senior NLP Engineer for Chatbot Development',
                description: 'We need an experienced NLP engineer to build a multilingual chatbot platform using transformer models. The project involves fine-tuning BERT models and deploying them to production.',
                requiredSkills: JSON.stringify(['Python', 'NLP', 'Transformers', 'PyTorch']),
                budgetMax: 95,
                preferredExperienceLevel: 'SENIOR',
            },
        }),

        // 2. Mid-level Computer Vision
        prisma.job.create({
            data: {
                title: 'Computer Vision Developer for Object Detection',
                description: 'Looking for a computer vision specialist to develop an object detection system for retail analytics. Experience with YOLO or similar frameworks required.',
                requiredSkills: JSON.stringify(['Python', 'Computer Vision', 'TensorFlow', 'OpenCV']),
                budgetMax: 75,
                preferredExperienceLevel: 'MID',
            },
        }),

        // 3. Junior ML Position
        prisma.job.create({
            data: {
                title: 'Junior Machine Learning Engineer',
                description: 'Entry-level position for an ML engineer to assist in developing predictive models for customer churn analysis. Great opportunity for learning and growth.',
                requiredSkills: JSON.stringify(['Python', 'Scikit-learn', 'Machine Learning']),
                budgetMax: 40,
                preferredExperienceLevel: 'JUNIOR',
            },
        }),

        // 4. Senior Deep Learning Project
        prisma.job.create({
            data: {
                title: 'Deep Learning Expert for Medical Imaging',
                description: 'We are developing an AI system for medical image analysis. Need an expert in deep learning and computer vision with experience in healthcare applications.',
                requiredSkills: JSON.stringify(['Python', 'Deep Learning', 'PyTorch', 'Computer Vision', 'TensorFlow']),
                budgetMax: 120,
                preferredExperienceLevel: 'SENIOR',
            },
        }),

        // 5. Mid-level Data Science
        prisma.job.create({
            data: {
                title: 'Data Scientist for Financial Analytics',
                description: 'Seeking a data scientist to build predictive models for financial forecasting. Experience with statistical modeling and time series analysis is essential.',
                requiredSkills: JSON.stringify(['Python', 'Statistical Modeling', 'Machine Learning', 'Data Analysis']),
                budgetMax: 65,
                preferredExperienceLevel: 'MID',
            },
        }),

        // 6. MLOps Position
        prisma.job.create({
            data: {
                title: 'MLOps Engineer for Model Deployment',
                description: 'Need an MLOps specialist to set up CI/CD pipelines for ML models and deploy them on AWS. Kubernetes experience is a plus.',
                requiredSkills: JSON.stringify(['Python', 'MLOps', 'AWS', 'Kubernetes', 'TensorFlow']),
                budgetMax: 100,
                preferredExperienceLevel: 'SENIOR',
            },
        }),

        // 7. General AI Development
        prisma.job.create({
            data: {
                title: 'AI Developer for E-commerce Recommendations',
                description: 'Building a recommendation engine for an e-commerce platform. Need someone proficient in collaborative filtering and deep learning techniques.',
                requiredSkills: JSON.stringify(['Python', 'Machine Learning', 'TensorFlow', 'Deep Learning']),
                budgetMax: 70,
                preferredExperienceLevel: 'MID',
            },
        }),
    ]);

    console.log(`✅ Created ${jobs.length} job postings\n`);

    // ============================================
    // Summary
    // ============================================
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║          ✅ Database Seeding Completed! ✅            ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`📊 Summary:`);
    console.log(`   → ${talents.length} African AI talents created`);
    console.log(`   → ${jobs.length} job postings created`);
    console.log('');
    console.log('🎯 Test the matching algorithm:');
    console.log('   GET http://localhost:3000/api/jobs/1/matches');
    console.log('');
    console.log('📚 View API Documentation:');
    console.log('   http://localhost:3000/api-docs');
    console.log('');
}

// Execute seed function
main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
