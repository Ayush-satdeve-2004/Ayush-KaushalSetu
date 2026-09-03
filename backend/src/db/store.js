const fs = require('fs');
const path = require('path');

// In-memory data store with JSON persistence capability
class DataStore {
  constructor() {
    this.users = [];
    this.skills = [];
    this.studentProfiles = [];
    this.skillClaims = [];
    this.companyProfiles = [];
    this.jobPostings = [];
    this.applications = [];
    this.courses = [];
    this.verificationRequests = [];
    this.facultyOpportunities = [];
    this.outcomes = [];
    this.notifications = [];
  }

  reset() {
    this.users = [];
    this.skills = [];
    this.studentProfiles = [];
    this.skillClaims = [];
    this.companyProfiles = [];
    this.jobPostings = [];
    this.applications = [];
    this.courses = [];
    this.verificationRequests = [];
    this.facultyOpportunities = [];
    this.outcomes = [];
    this.notifications = [];
  }
}

const db = new DataStore();

module.exports = db;
