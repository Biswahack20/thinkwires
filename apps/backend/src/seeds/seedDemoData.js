import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import config from '../configs/dotenv.js';

import Employee from '../models/employee.mongo.model.js';
import Candidate from '../models/candidate.mongo.model.js';
import Client from '../models/client.mongo.model.js';
import JobRequirement from '../models/job.mongo.model.js';
import Placement from '../models/placement.mongo.model.js';
import Page from '../models/page.mongo.model.js';
import Article from '../models/article.mongo.model.js';
import Media from '../models/media.mongo.model.js';
import Announcement from '../models/announcement.mongo.model.js';
import Activity from '../models/activity.mongo.model.js';
import UserMongo from '../models/user.mongo.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedDatabase = async () => {
  const seedFilePath = path.join(__dirname, 'adminSeedData.json');
  const rawData = fs.readFileSync(seedFilePath, 'utf8');
  const data = JSON.parse(rawData);

  console.log('🌱 Seeding MongoDB collections from adminSeedData.json...');

  // 1. Users
  for (const u of data.users) {
    await UserMongo.findOneAndUpdate(
      { email: u.email },
      {
        name: u.name,
        email: u.email,
        password: 'demo_password_hash_secure',
        role: u.role,
        isActive: true,
      },
      { upsert: true, new: true }
    );
  }

  // 2. Employees
  for (const emp of data.employees) {
    await Employee.findOneAndUpdate(
      { email: emp.email },
      { ...emp },
      { upsert: true, new: true }
    );
  }

  // 3. Candidates
  for (const cand of data.candidates) {
    await Candidate.findOneAndUpdate(
      { email: cand.email },
      { ...cand },
      { upsert: true, new: true }
    );
  }

  // 4. Clients
  for (const cli of data.clients) {
    await Client.findOneAndUpdate(
      { companyName: cli.companyName },
      { ...cli },
      { upsert: true, new: true }
    );
  }

  // 5. Jobs
  for (const job of data.jobs) {
    await JobRequirement.findOneAndUpdate(
      { title: job.title, client: job.client },
      { ...job },
      { upsert: true, new: true }
    );
  }

  // 6. Placements
  for (const plc of data.placements) {
    await Placement.findOneAndUpdate(
      { candidateOrEmployeeName: plc.candidateOrEmployeeName, clientName: plc.clientName },
      { ...plc },
      { upsert: true, new: true }
    );
  }

  // 7. Pages
  for (const pg of data.pages) {
    await Page.findOneAndUpdate(
      { slug: pg.slug },
      { ...pg },
      { upsert: true, new: true }
    );
  }

  // 8. Articles
  for (const art of data.articles) {
    await Article.findOneAndUpdate(
      { slug: art.slug },
      { ...art },
      { upsert: true, new: true }
    );
  }

  // 9. Media
  for (const med of data.media) {
    await Media.findOneAndUpdate(
      { fileUrl: med.fileUrl },
      { ...med },
      { upsert: true, new: true }
    );
  }

  // 10. Announcements
  for (const ann of data.announcements) {
    await Announcement.findOneAndUpdate(
      { title: ann.title },
      { ...ann },
      { upsert: true, new: true }
    );
  }

  // 11. Activities
  for (const act of data.activities) {
    await Activity.findOneAndUpdate(
      { action: act.action, description: act.description },
      { ...act },
      { upsert: true, new: true }
    );
  }

  console.log('✅ MongoDB database successfully seeded with demo dataset!');
};

// If run directly from terminal
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mongoose
    .connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(async () => {
      console.log('Connected to MongoDB, starting seeding...');
      await seedDatabase();
      await mongoose.disconnect();
      console.log('Seeding finished, connection closed.');
      process.exit(0);
    })
    .catch((err) => {
      console.warn('⚠️ MongoDB connection failed during standalone seed execution:', err.message);
      console.log('ℹ️ You can run MongoDB or rely on the dual-mode in-memory seed dataset.');
      process.exit(0);
    });
}
