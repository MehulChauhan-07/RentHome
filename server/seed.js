#!/usr/bin/env node

// Simple script to run the seed function
import { seedDatabase } from './scripts/seedData.js';

seedDatabase().catch(console.error);
