/**
 * Database Seed Script
 * Seeds default categories
 */

require('dotenv').config();
const { initializeDatabase } = require('./connection');
const CategoryModel = require('../features/categories/model/category.model');

// Default categories
const defaultCategories = [
  { name: 'AI', color: '#8b5cf6', icon: 'brain', order: 1, isDefault: true },
  { name: 'System Design', color: '#06b6d4', icon: 'cpu', order: 2, isDefault: true },
  { name: 'Cybersecurity', color: '#ef4444', icon: 'shield', order: 3, isDefault: true },
  { name: 'Badminton Education', color: '#22c55e', icon: 'activity', order: 4, isDefault: true },
  { name: 'Miscellaneous', color: '#6b7280', icon: 'folder', order: 5, isDefault: true }
];

async function seed() {
  try {
    console.log('🔄 Initializing database...');
    await initializeDatabase();

    // Seed categories
    console.log('\n📁 Seeding categories...');
    const existingCategories = CategoryModel.count();

    if (existingCategories === 0) {
      CategoryModel.insertMany(defaultCategories);
      console.log(`✅ Created ${defaultCategories.length} default categories`);
    } else {
      console.log(`⏭️ Skipped - ${existingCategories} categories already exist`);
    }

    // Show summary
    const categories = CategoryModel.findAll();
    console.log('\n📊 Database Summary:');
    console.log(`   Categories: ${categories.length}`);
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.videoCount} videos)`);
    });

    console.log('\n✅ Seed completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

seed();
