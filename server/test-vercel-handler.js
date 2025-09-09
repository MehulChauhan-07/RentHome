// Test script to verify Vercel handler works
import handler from './api/index.js';

// Mock request and response objects
const mockReq = {
  method: 'GET',
  url: '/health',
  headers: {
    'content-type': 'application/json'
  }
};

const mockRes = {
  statusCode: 200,
  _headers: {},
  setHeader(key, value) {
    this._headers[key] = value;
  },
  end(data) {
    console.log('✅ Response Status:', this.statusCode);
    console.log('✅ Response Headers:', this._headers);
    console.log('✅ Response Data:', data);
    process.exit(0);
  },
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(data));
  }
};

console.log('🧪 Testing Vercel handler...');
handler(mockReq, mockRes).catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
