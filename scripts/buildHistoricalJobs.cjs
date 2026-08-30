const fs = require('fs');
const path = require('path');

const jobs = [];

// Helper to add job
function addJob(id, title, category, postDate, state, shortInfo, start, last, generalFee, scStFee, applyLink, officialLink, notificationLink) {
  jobs.push({
    id,
    title,
    category,
    postDate,
    isNew: postDate.includes('2026') && (postDate.includes('08-') || postDate.includes('07-')),
    state: state || 'All India',
    shortInfo: shortInfo || title,
    dates: {
      start: start || postDate,
      last: last || 'Closed'
    },
    fees: {
      general: generalFee || '₹100',
      scSt: scStFee || '₹0'
    },
    links: {
      apply: applyLink || 'https://ssc.gov.in',
      official: officialLink || 'https://ssc.gov.in',
      notification: notificationLink || 'https://ssc.gov.in'
    }
  });
}

// ==========================================
// 1. LATEST JOBS (2016 - 2026)
// ==========================================
// 2026
addJob('job-2026-uppolice-constable', 'UP Police Constable Recruitment 2026 Online Form', 'latest-jobs', '18-08-2026', 'Uttar Pradesh', 'Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB) invites online application for 60,244 Constable posts.', '15-08-2026', '15-09-2026', '₹400', '₹400', 'https://uppbpb.gov.in', 'https://uppbpb.gov.in', 'https://uppbpb.gov.in');
addJob('job-2026-ssc-cgl', 'SSC CGL Recruitment 2026 Online Form', 'latest-jobs', '12-08-2026', 'Central', 'Staff Selection Commission (SSC) Combined Graduate Level CGL 2026 Examination for Group B and Group C 17,727 Posts.', '10-08-2026', '10-09-2026', '₹100', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');
addJob('job-2026-rrb-ntpc', 'Railway RRB NTPC Graduate & Under Graduate Posts 2026', 'latest-jobs', '05-08-2026', 'Central', 'Railway Recruitment Board (RRB) Non-Technical Popular Categories NTPC Recruitment 2026 for 11,558 Posts.', '01-08-2026', '31-08-2026', '₹500', '₹250', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');
addJob('job-2026-upsc-cse', 'UPSC Civil Services IAS / IFS Pre 2026 Online Form', 'latest-jobs', '14-02-2026', 'Central', 'Union Public Service Commission (UPSC) Civil Services and Forest Service (IAS / IFS) Preliminary Examination 2026.', '14-02-2026', '05-03-2026', '₹100', '₹0', 'https://upsconline.nic.in', 'https://upsc.gov.in', 'https://upsconline.nic.in');
addJob('job-2026-sbi-po', 'SBI Probationary Officer PO Recruitment 2026', 'latest-jobs', '20-07-2026', 'Central', 'State Bank of India (SBI) PO Recruitment 2026 for 2000 Posts.', '15-07-2026', '05-08-2026', '₹750', '₹0', 'https://sbi.co.in/careers', 'https://sbi.co.in', 'https://sbi.co.in/careers');
addJob('job-2026-ssc-gd', 'SSC GD Constable in CAPF, SSF, Rifleman GD 2026', 'latest-jobs', '10-06-2026', 'Central', 'Staff Selection Commission (SSC) Constable GD in BSF, CISF, CRPF, SSB, ITBP, AR, SSF 39,481 Posts.', '05-06-2026', '05-07-2026', '₹100', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');
addJob('job-2026-bpsc-71', 'BPSC 71st Combined Competitive Examination CCE 2026', 'latest-jobs', '25-05-2026', 'Bihar', 'Bihar Public Service Commission (BPSC) 71st Pre Examination 2026 for Administrative, Police, and Finance Services.', '20-05-2026', '15-06-2026', '₹600', '₹150', 'https://onlinebpsc.bihar.gov.in', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in');
addJob('job-2026-navy-agniveer', 'Indian Navy Agniveer MR & SSR 02/2026 Batch Online Form', 'latest-jobs', '15-04-2026', 'Central', 'Join Indian Navy Nausena Bharti Agniveer SSR and MR 02/2026 Batch.', '10-04-2026', '30-04-2026', '₹550', '₹550', 'https://joinindiannavy.gov.in', 'https://joinindiannavy.gov.in', 'https://joinindiannavy.gov.in');

// 2025
addJob('job-2025-ssc-chsl', 'SSC CHSL 10+2 Recruitment 2025 Online Form', 'latest-jobs', '08-04-2025', 'Central', 'Staff Selection Commission Combined Higher Secondary Level (10+2) Examination 2025 for 3,712 Posts.', '08-04-2025', '07-05-2025', '₹100', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');
addJob('job-2025-rrb-groupd', 'Railway RRC Group D Level-1 Posts Recruitment 2025', 'latest-jobs', '15-03-2025', 'Central', 'Railway Recruitment Cell (RRC) CEN Group D 32,000 Posts Notification.', '15-03-2025', '14-04-2025', '₹500', '₹250', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');
addJob('job-2025-uppsc-pre', 'UPPSC Combined State Upper Subordinate Pre PCS 2025', 'latest-jobs', '01-01-2025', 'Uttar Pradesh', 'Uttar Pradesh Public Service Commission (UPPSC) Combined State / Upper Subordinate Services Examination 2025.', '01-01-2025', '02-02-2025', '₹125', '₹65', 'https://uppsc.up.nic.in', 'https://uppsc.up.nic.in', 'https://uppsc.up.nic.in');
addJob('job-2025-ibps-clerk', 'IBPS Clerk XV Recruitment 2025 Online Form', 'latest-jobs', '01-07-2025', 'Central', 'Institute of Banking Personnel Selection (IBPS) Clerk 15th Recruitment for 6,128 Posts.', '01-07-2025', '21-07-2025', '₹850', '₹175', 'https://ibps.in', 'https://ibps.in', 'https://ibps.in');
addJob('job-2025-bihar-police-si', 'Bihar Police SI & Sub Inspector Prohibition 2025', 'latest-jobs', '12-09-2025', 'Bihar', 'Bihar Police Subordinate Services Commission (BPSSC) Sub Inspector SI 1275 Posts.', '15-09-2025', '15-10-2025', '₹700', '₹400', 'https://bpssc.bih.nic.in', 'https://bpssc.bih.nic.in', 'https://bpssc.bih.nic.in');

// 2024
addJob('job-2024-rrb-alp', 'Railway RRB ALP Assistant Loco Pilot 2024', 'latest-jobs', '20-01-2024', 'Central', 'Railway Recruitment Board (RRB) Assistant Loco Pilot (ALP) CEN 01/2024 for 18,799 Posts.', '20-01-2024', '19-02-2024', '₹500', '₹250', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');
addJob('job-2024-ssc-cgl', 'SSC CGL Combined Graduate Level Exam 2024', 'latest-jobs', '24-06-2024', 'Central', 'SSC CGL 2024 Examination for 17,727 Vacancies.', '24-06-2024', '27-07-2024', '₹100', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');
addJob('job-2024-bpsc-tre3', 'BPSC School Teacher TRE 3.0 Recruitment 2024', 'latest-jobs', '10-02-2024', 'Bihar', 'Bihar School Teacher TRE 3.0 Recruitment 2024 for 87,774 Posts for Primary, Middle, Secondary & Senior Secondary.', '10-02-2024', '26-02-2024', '₹750', '₹200', 'https://onlinebpsc.bihar.gov.in', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in');
addJob('job-2024-rpf-si-constable', 'RPF Sub Inspector and Constable Recruitment 2024', 'latest-jobs', '15-04-2024', 'Central', 'Railway Protection Force (RPF) CEN 01/2024 & 02/2024 for 4,660 SI & Constable Posts.', '15-04-2024', '14-05-2024', '₹500', '₹250', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');

// 2023
addJob('job-2023-bpsc-tre1', 'Bihar BPSC Primary, TGT, PGT Teacher Recruitment 2023', 'latest-jobs', '15-06-2023', 'Bihar', 'Bihar Teacher TRE 1.0 Online Form for 1,70,461 Posts.', '15-06-2023', '15-07-2023', '₹750', '₹200', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in');
addJob('job-2023-ssc-mts', 'SSC Multi Tasking Staff MTS & Havaldar 2023', 'latest-jobs', '30-06-2023', 'Central', 'Staff Selection Commission (SSC) MTS & Havaldar CBIC/CBN Exam 2023.', '30-06-2023', '21-07-2023', '₹100', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');
addJob('job-2023-delhi-police-constable', 'Delhi Police Constable Executive Male / Female 2023', 'latest-jobs', '01-09-2023', 'Delhi', 'Staff Selection Commission Delhi Police Constable Executive 7547 Posts.', '01-09-2023', '30-09-2023', '₹100', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');
addJob('job-2023-mp-police', 'MP Police Constable Recruitment 2023 Online Form', 'latest-jobs', '26-06-2023', 'Madhya Pradesh', 'MP Employees Selection Board (MPESB) Police Constable 7411 Posts.', '26-06-2023', '10-07-2023', '₹500', '₹250', 'https://esb.mp.gov.in', 'https://esb.mp.gov.in', 'https://esb.mp.gov.in');

// 2022
addJob('job-2022-ssc-cgl', 'SSC CGL 2022 (Mega 37,409 Vacancies) Online Form', 'latest-jobs', '17-09-2022', 'Central', 'Staff Selection Commission Combined Graduate Level Examination 2022 with new Tier 2 syllabus and 37,409 vacancies.', '17-09-2022', '13-10-2022', '₹100', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');
addJob('job-2022-up-lekhpal', 'UPSSSC Rajasva Lekhpal Main Exam 2022', 'latest-jobs', '07-01-2022', 'Uttar Pradesh', 'Uttar Pradesh Subordinate Services Selection Commission Rajasva Lekhpal 8,085 Posts.', '07-01-2022', '28-01-2022', '₹25', '₹25', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');
addJob('job-2022-agniveer-scheme', 'Indian Army Agniveer Rally Recruitment 2022', 'latest-jobs', '20-06-2022', 'Central', 'Join Indian Army Agnipath Scheme Agniveer GD, Technical, Clerk, Tradesman 2022.', '20-06-2022', '05-08-2022', '₹0', '₹0', 'https://joinindianarmy.nic.in', 'https://joinindianarmy.nic.in', 'https://joinindianarmy.nic.in');

// 2021
addJob('job-2021-uppolice-si', 'UP Police Sub Inspector SI, Platoon Commander 2021', 'latest-jobs', '01-04-2021', 'Uttar Pradesh', 'UPPRPB UP Police Sub Inspector SI Civil Police, Platoon Commander, Fire Officer 9534 Posts.', '01-04-2021', '15-06-2021', '₹400', '₹400', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in');
addJob('job-2021-upsssc-pet', 'UPSSSC Preliminary Eligibility Test PET 2021', 'latest-jobs', '25-05-2021', 'Uttar Pradesh', 'UPSSSC First Preliminary Eligibility Test (PET 2021) for Group C Recruitment.', '25-05-2021', '21-06-2021', '₹185', '₹95', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');
addJob('job-2021-ssc-gd', 'SSC GD Constable in CAPFs, NIA, SSF, Assam Rifles 2021', 'latest-jobs', '17-07-2021', 'Central', 'Staff Selection Commission Constable GD 25271 Posts Notification.', '17-07-2021', '31-08-2021', '₹100', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');

// 2020
addJob('job-2020-delhi-police', 'Delhi Police Constable Male / Female 2020 Online Form', 'latest-jobs', '01-08-2020', 'Delhi', 'Staff Selection Commission (SSC) Delhi Police Constable 5846 Posts.', '01-08-2020', '07-09-2020', '₹100', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');
addJob('job-2020-ssc-cgl', 'SSC CGL 2020 Combined Graduate Level Online Form', 'latest-jobs', '29-12-2020', 'Central', 'Staff Selection Commission SSC CGL 2020 Examination for 7035 Posts.', '29-12-2020', '31-01-2021', '₹100', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');
addJob('job-2020-bihar-police', 'Bihar Police Constable 8415 Posts 2020 Online Form', 'latest-jobs', '13-11-2020', 'Bihar', 'Central Selection Board of Constable (CSBC) Bihar Police Constable 8415 Posts.', '13-11-2020', '14-12-2020', '₹450', '₹112', 'https://csbc.bih.nic.in', 'https://csbc.bih.nic.in', 'https://csbc.bih.nic.in');

// 2019
addJob('job-2019-rrb-ntpc', 'Railway RRB NTPC 35,208 Posts (CEN 01/2019) Online Form', 'latest-jobs', '01-03-2019', 'Central', 'Railway Recruitment Board Non-Technical Popular Categories NTPC 35,208 Posts Notification.', '01-03-2019', '31-03-2019', '₹500', '₹250', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');
addJob('job-2019-rrc-groupd', 'Railway RRC 01/2019 Group D Level-1 (1,03,769 Posts)', 'latest-jobs', '12-03-2019', 'Central', 'Railway Recruitment Cell (RRC) Group D 1,03,769 Mega Posts Online Form.', '12-03-2019', '12-04-2019', '₹500', '₹250', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');
addJob('job-2019-uppolice-49568', 'UP Police 49568 Constable Recruitment 2019', 'latest-jobs', '22-01-2019', 'Uttar Pradesh', 'Uttar Pradesh Police 49,568 Resident Citizen Police & PAC Constable Recruitment.', '22-01-2019', '15-02-2019', '₹400', '₹400', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in');

// 2018
addJob('job-2018-rrb-alp', 'Railway RRB ALP & Technician 64,371 Posts (CEN 01/2018)', 'latest-jobs', '03-02-2018', 'Central', 'Railway Assistant Loco Pilot ALP and Technician 64,371 Vacancies Online Form.', '03-02-2018', '31-03-2018', '₹500', '₹250', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in');
addJob('job-2018-rrb-groupd', 'Railway RRB Group D 62,907 Posts (CEN 02/2018)', 'latest-jobs', '10-02-2018', 'Central', 'Railway Recruitment Board Group D Level 1 Track Maintainer, Helper, Pointsman 62,907 Posts.', '10-02-2018', '31-03-2018', '₹500', '₹250', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in');
addJob('job-2018-uppolice-41520', 'UP Police Constable 41,520 Posts 2018 Online Form', 'latest-jobs', '22-01-2018', 'Uttar Pradesh', 'UPPRPB 41,520 Civil Police and PAC Constable Bharti 2018.', '22-01-2018', '22-02-2018', '₹400', '₹400', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in');
addJob('job-2018-upsssc-vdo', 'UPSSSC Gram Panchayat Adhikari VDO 1953 Posts 2018', 'latest-jobs', '30-05-2018', 'Uttar Pradesh', 'UPSSSC Village Development Officer VDO, Gram Panchayat Adhikari 1953 Posts.', '30-05-2018', '25-06-2018', '₹185', '₹95', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');

// 2017
addJob('job-2017-ssc-cgl', 'SSC CGL Combined Graduate Level Exam 2017', 'latest-jobs', '16-05-2017', 'Central', 'Staff Selection Commission SSC CGL 2017 Online Application Form.', '16-05-2017', '16-06-2017', '₹100', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');
addJob('job-2017-ssc-mts', 'SSC Multi Tasking Staff Non Technical MTS 2016-2017', 'latest-jobs', '15-01-2017', 'Central', 'SSC MTS Examination 2016-2017 8300 Posts.', '15-01-2017', '15-02-2017', '₹100', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');
addJob('job-2017-ibps-po7', 'IBPS PO / MT VII Recruitment 2017 Online Form', 'latest-jobs', '16-08-2017', 'Central', 'Institute of Banking Personnel Selection CWE PO / MT 7th Online Form.', '16-08-2017', '05-09-2017', '₹600', '₹100', 'https://ibps.in', 'https://ibps.in', 'https://ibps.in');

// 2016
addJob('job-2016-ssc-cgl', 'SSC CGL 2016 (First Online Computer Based Exam)', 'latest-jobs', '13-02-2016', 'Central', 'Staff Selection Commission CGL 2016 First Online Tier 1 Computer Based Exam.', '13-02-2016', '21-03-2016', '₹100', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');
addJob('job-2016-rrb-ntpc', 'Railway RRB NTPC 18,252 Posts (CEN 03/2015 - 2016)', 'latest-jobs', '26-12-2015', 'Central', 'Railway Recruitment Board NTPC Graduate Commercial Apprentice, Traffic Apprentice, Goods Guard 18,252 Posts.', '26-12-2015', '25-01-2016', '₹100', '₹0', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in');
addJob('job-2016-uppolice-constable', 'UP Police Male / Female Constable 34,716 Posts 2016', 'latest-jobs', '18-01-2016', 'Uttar Pradesh', 'UPPRPB Uttar Pradesh Police 34,716 Constable Recruitment 2016.', '18-01-2016', '24-02-2016', '₹200', '₹200', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in');


// ==========================================
// 2. RESULTS (2016 - 2026)
// ==========================================
addJob('res-2026-upsc-cse', 'UPSC Civil Services CSE 2025-2026 Final Result & Marks', 'results', '15-04-2026', 'Central', 'Union Public Service Commission (UPSC) Civil Services IAS, IFS, IPS Final Selection List & Marks 2026.', 'Final List Out', 'Active', '₹0', '₹0', 'https://upsc.gov.in', 'https://upsc.gov.in', 'https://upsc.gov.in');
addJob('res-2026-uppolice-constable', 'UP Police Constable 60,244 Posts Final Result 2026', 'results', '20-08-2026', 'Uttar Pradesh', 'UPPRPB UP Police Constable Re-Exam Final Result and Cutoff Marks 2026.', 'Result Out', 'Active', '₹0', '₹0', 'https://uppbpb.gov.in', 'https://uppbpb.gov.in', 'https://uppbpb.gov.in');
addJob('res-2026-ssc-cgl', 'SSC CGL 2025-2026 Tier 1 & Final Result Declared', 'results', '10-07-2026', 'Central', 'Staff Selection Commission (SSC) CGL 2025-2026 Merit List and Cutoff PDF.', 'Result Out', 'Active', '₹0', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');
addJob('res-2026-up-board', 'UP Board Class 10th High School & 12th Inter Result 2026', 'results', '25-04-2026', 'Uttar Pradesh', 'UPMSP Prayagraj UP Board High School Class 10 and Intermediate Class 12 Annual Board Exam Result 2026.', 'Declared', 'Active', '₹0', '₹0', 'https://upmsp.edu.in', 'https://upmsp.edu.in', 'https://upmsp.edu.in');
addJob('res-2026-neet-ug', 'NTA NEET UG 2026 Scorecard & All India Rank List', 'results', '14-06-2026', 'Central', 'National Testing Agency (NTA) NEET UG 2026 Result, Scorecard, and Topper List.', 'Scorecard Out', 'Active', '₹0', '₹0', 'https://exams.nta.ac.in/NEET', 'https://nta.ac.in', 'https://exams.nta.ac.in/NEET');

// 2025
addJob('res-2025-ssc-gd', 'SSC GD Constable 2025 Final Result & Force Allocation', 'results', '15-11-2025', 'Central', 'SSC Constable GD in BSF, CISF, CRPF, SSB, ITBP, AR Final Selected Candidates List.', 'Declared', 'Archive', '₹0', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');
addJob('res-2025-rrb-alp', 'Railway RRB ALP Stage 1 & 2 CBT Result 2025', 'results', '18-09-2025', 'Central', 'Railway Recruitment Board ALP CEN 01/2024 CBT Result & Scorecard 2025.', 'Declared', 'Archive', '₹0', '₹0', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');
addJob('res-2025-upsssc-pet', 'UPSSSC PET 2024-2025 Scorecard & Normalized Score', 'results', '22-01-2025', 'Uttar Pradesh', 'UPSSSC Preliminary Eligibility Test PET 2024-2025 Official Scorecard.', 'Scorecard Out', 'Archive', '₹0', '₹0', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');

// 2024
addJob('res-2024-ssc-cgl', 'SSC CGL 2024 Tier 1 Result and Cutoff Marks', 'results', '19-09-2024', 'Central', 'SSC Combined Graduate Level 2024 Tier 1 Result for Qualified Candidates.', 'Declared', 'Archive', '₹0', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');
addJob('res-2024-bpsc-tre3', 'Bihar BPSC TRE 3.0 School Teacher Result 2024', 'results', '15-11-2024', 'Bihar', 'BPSC TRE 3.0 Head Teacher and Primary/Secondary Teacher Merit List 2024.', 'Declared', 'Archive', '₹0', '₹0', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in');

// 2023
addJob('res-2023-ssc-cgl', 'SSC CGL 2023 Final Selection Result & Cutoff List', 'results', '04-12-2023', 'Central', 'Staff Selection Commission CGL 2023 Final Merit List and Post Allocation.', 'Declared', 'Archive', '₹0', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');
addJob('res-2023-bpsc-tre1', 'BPSC Bihar Teacher TRE 1.0 Final Selection Result 2023', 'results', '22-10-2023', 'Bihar', 'BPSC Bihar 1.70 Lakh Teacher Recruitment TRE 1.0 Final Selection List.', 'Declared', 'Archive', '₹0', '₹0', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in');
addJob('res-2023-upsssc-vdo', 'UPSSSC VDO Re-Exam 2018-2023 Result & Cutoff', 'results', '21-02-2024', 'Uttar Pradesh', 'UPSSSC Gram Panchayat Adhikari VDO 2018 Re-Exam Result 2023.', 'Declared', 'Archive', '₹0', '₹0', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');

// 2022
addJob('res-2022-rrb-groupd', 'Railway RRB Group D Level-1 CBT Final Result 2022', 'results', '22-12-2022', 'Central', 'Railway Recruitment Cell RRC 01/2019 Group D Level-1 CBT Scorecard and PET List.', 'Declared', 'Archive', '₹0', '₹0', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');
addJob('res-2022-upsssc-lekhpal', 'UPSSSC Rajasva Lekhpal 2022 Written Exam Result', 'results', '02-05-2023', 'Uttar Pradesh', 'UPSSSC Rajasva Lekhpal 8,085 Posts Result and Cutoff for Document Verification.', 'Declared', 'Archive', '₹0', '₹0', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');

// 2021
addJob('res-2021-uppolice-si', 'UP Police SI 9534 Posts Written Exam Result 2021', 'results', '14-04-2022', 'Uttar Pradesh', 'UPPRPB Sub Inspector SI, Platoon Commander 9534 Posts DV/PST Selection List.', 'Declared', 'Archive', '₹0', '₹0', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in');
addJob('res-2021-upsssc-pet', 'UPSSSC PET 2021 Result Scorecard (First Ever PET)', 'results', '28-10-2021', 'Uttar Pradesh', 'UPSSSC PET 2021 Percentile Score & Normalized Marks Scorecard.', 'Scorecard Out', 'Archive', '₹0', '₹0', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');

// 2020
addJob('res-2020-up-69000', 'UP 69,000 Assistant Teacher Final Selection Result 2020', 'results', '13-05-2020', 'Uttar Pradesh', 'Uttar Pradesh Basic Education Board 69,000 Sahayak Adhyapak Final Merit List.', 'Declared', 'Archive', '₹0', '₹0', 'http://updeled.gov.in', 'http://updeled.gov.in', 'http://updeled.gov.in');
addJob('res-2020-ssc-cgl', 'SSC CGL 2020 Final Merit Result and Marks', 'results', '31-10-2022', 'Central', 'Staff Selection Commission CGL 2020 Final Selected Candidates List.', 'Declared', 'Archive', '₹0', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');

// 2019
addJob('res-2019-uppolice-49568', 'UP Police 49,568 Constable Final Selection Result 2019', 'results', '02-03-2020', 'Uttar Pradesh', 'UPPRPB 49568 Police Constable Final Merit List & Medical Exam Selection List.', 'Declared', 'Archive', '₹0', '₹0', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in');
addJob('res-2019-rrb-alp', 'Railway RRB ALP & Technician 2018-2019 Final Panel Result', 'results', '13-12-2019', 'Central', 'RRB ALP 64,371 Posts Final Replacement and Selection Panel List.', 'Declared', 'Archive', '₹0', '₹0', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in');

// 2018
addJob('res-2018-uppolice-41520', 'UP Police 41,520 Constable Final Result 2018', 'results', '18-02-2019', 'Uttar Pradesh', 'UPPRPB 41520 Constable Final Result and Cutoff Marks Archive.', 'Declared', 'Archive', '₹0', '₹0', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in');
addJob('res-2018-rrb-groupd', 'Railway RRB Group D 62,907 Posts CBT Result 2018', 'results', '04-03-2019', 'Central', 'RRB CEN 02/2018 Group D CBT Normalized Scorecard & PET Qualified List.', 'Declared', 'Archive', '₹0', '₹0', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in');

// 2017
addJob('res-2017-ssc-cgl', 'SSC CGL 2017 Final Result and Post Allocation', 'results', '15-11-2019', 'Central', 'Staff Selection Commission CGL 2017 Final Merit List after Supreme Court Verdict.', 'Declared', 'Archive', '₹0', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');
addJob('res-2017-uppolice-si', 'UP Police SI 2016-2017 Final Result & Cutoff', 'results', '28-02-2019', 'Uttar Pradesh', 'UPPRPB Sub Inspector Civil Police & Platoon Commander 2016 Final Selection List.', 'Declared', 'Archive', '₹0', '₹0', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in');

// 2016
addJob('res-2016-rrb-ntpc', 'Railway RRB NTPC 2015-2016 Stage 1 CBT Result', 'results', '07-12-2016', 'Central', 'RRB NTPC CEN 03/2015 Stage 1 First Computer Based Test Normalized Score.', 'Declared', 'Archive', '₹0', '₹0', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in');
addJob('res-2016-ssc-cgl', 'SSC CGL 2016 Final Result & Department Allocation', 'results', '05-08-2017', 'Central', 'Staff Selection Commission CGL 2016 Final Selection Merit List.', 'Declared', 'Archive', '₹0', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');


// ==========================================
// 3. ADMIT CARDS (2016 - 2026)
// ==========================================
addJob('adm-2026-ssc-cgl', 'SSC CGL 2026 Tier 1 Admit Card & Exam City Status', 'admit-cards', '01-09-2026', 'Central', 'Staff Selection Commission CGL 2026 Tier 1 Computer Based Examination Hall Ticket.', 'Active', 'Exam Live', '₹0', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');
addJob('adm-2026-upsc-pre', 'UPSC Civil Services CSE IAS / IFS Prelims Admit Card 2026', 'admit-cards', '08-05-2026', 'Central', 'Union Public Service Commission Civil Services Preliminary Examination 2026 e-Admit Card.', 'Released', 'Active', '₹0', '₹0', 'https://upsconline.nic.in', 'https://upsc.gov.in', 'https://upsconline.nic.in');
addJob('adm-2026-rrb-ntpc', 'Railway RRB NTPC CBT-1 Exam City & Admit Card 2026', 'admit-cards', '25-08-2026', 'Central', 'Railway Recruitment Board NTPC 2026 CBT Stage 1 City Intimation Slip & Call Letter.', 'Live Link', 'Active', '₹0', '₹0', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');
addJob('adm-2026-ctet', 'CTET July 2026 Admit Card & Exam Centre City', 'admit-cards', '01-07-2026', 'Central', 'Central Board of Secondary Education (CBSE) CTET July 2026 Hall Ticket.', 'Released', 'Active', '₹0', '₹0', 'https://ctet.nic.in', 'https://ctet.nic.in', 'https://ctet.nic.in');

// 2025
addJob('adm-2025-ssc-gd', 'SSC GD Constable 2025 Admit Card & Application Status', 'admit-cards', '10-01-2025', 'Central', 'Staff Selection Commission GD Constable CBT Examination 2025 Hall Ticket.', 'Released', 'Archive', '₹0', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');
addJob('adm-2025-rrb-alp', 'Railway RRB ALP Stage 1 CBT Admit Card 2025', 'admit-cards', '15-08-2025', 'Central', 'RRB Assistant Loco Pilot ALP CEN 01/2024 Stage 1 CBT Call Letter.', 'Released', 'Archive', '₹0', '₹0', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');

// 2024
addJob('adm-2024-uppolice-reexam', 'UP Police Constable Re-Exam Admit Card 2024 (60,244 Posts)', 'admit-cards', '17-08-2024', 'Uttar Pradesh', 'UPPRPB UP Police Constable Re-Exam 23-31 August 2024 Hall Ticket & District Slip.', 'Released', 'Archive', '₹0', '₹0', 'https://uppbpb.gov.in', 'https://uppbpb.gov.in', 'https://uppbpb.gov.in');
addJob('adm-2024-ssc-cgl', 'SSC CGL 2024 Tier 1 Admit Card All Regions (CR, NR, ER, WR)', 'admit-cards', '02-09-2024', 'Central', 'SSC CGL Tier 1 2024 Admit Card and Application Status Portal.', 'Released', 'Archive', '₹0', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');

// 2023
addJob('adm-2023-bpsc-tre1', 'Bihar BPSC Teacher TRE 1.0 Admit Card & Exam Centre Slip', 'admit-cards', '10-08-2023', 'Bihar', 'BPSC Bihar 1.70 Lakh Teacher TRE 1.0 Examination Admit Card with Photo Upload.', 'Released', 'Archive', '₹0', '₹0', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in');
addJob('adm-2023-upsssc-vdo', 'UPSSSC VDO 2018 Re-Exam Admit Card 2023', 'admit-cards', '19-06-2023', 'Uttar Pradesh', 'UPSSSC Gram Panchayat Adhikari VDO 2018 Re-Exam 26-27 June 2023 Admit Card.', 'Released', 'Archive', '₹0', '₹0', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');

// 2022
addJob('adm-2022-rrb-groupd', 'Railway Group D Phase 1 to 5 Exam City & Admit Card 2022', 'admit-cards', '12-08-2022', 'Central', 'RRC 01/2019 Group D CBT Phase wise Call Letter and City Slip.', 'Released', 'Archive', '₹0', '₹0', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');
addJob('adm-2022-upsssc-lekhpal', 'UPSSSC Lekhpal 8,085 Posts Mains Exam Admit Card 2022', 'admit-cards', '25-07-2022', 'Uttar Pradesh', 'UPSSSC Rajasva Lekhpal 31 July 2022 Mains Examination Hall Ticket.', 'Released', 'Archive', '₹0', '₹0', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');

// 2021
addJob('adm-2021-uppolice-si', 'UP Police SI 9534 Posts Online Exam Admit Card 2021', 'admit-cards', '01-11-2021', 'Uttar Pradesh', 'UPPRPB Sub Inspector 3 Phases Online Examination Admit Card 2021.', 'Released', 'Archive', '₹0', '₹0', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in');
addJob('adm-2021-upsssc-pet', 'UPSSSC PET 2021 Admit Card 24 August Exam', 'admit-cards', '17-08-2021', 'Uttar Pradesh', 'UPSSSC Preliminary Eligibility Test PET 2021 First Exam Admit Card.', 'Released', 'Archive', '₹0', '₹0', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');

// 2020
addJob('adm-2020-delhi-police', 'Delhi Police Constable 2020 CBT Exam Admit Card', 'admit-cards', '18-11-2020', 'Delhi', 'SSC Delhi Police Constable 27 Nov - 14 Dec 2020 Admit Card.', 'Released', 'Archive', '₹0', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');

// 2019
addJob('adm-2019-uppolice-49568', 'UP Police 49,568 Constable Written Exam Admit Card 2019', 'admit-cards', '22-01-2019', 'Uttar Pradesh', 'UPPRPB 49568 Constable 27-28 January 2019 Exam Call Letter.', 'Released', 'Archive', '₹0', '₹0', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in');

// 2018
addJob('adm-2018-rrb-alp', 'Railway RRB ALP & Technician 2018 Stage 1 CBT Admit Card', 'admit-cards', '05-08-2018', 'Central', 'RRB CEN 01/2018 ALP Stage 1 CBT Online Exam Hall Ticket.', 'Released', 'Archive', '₹0', '₹0', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in');
addJob('adm-2018-rrb-groupd', 'Railway RRB Group D 2018 CBT Exam City & Call Letter', 'admit-cards', '09-09-2018', 'Central', 'RRB CEN 02/2018 Group D 17 Sept 2018 Onwards Call Letter.', 'Released', 'Archive', '₹0', '₹0', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in');

// 2017
addJob('adm-2017-ssc-cgl', 'SSC CGL 2017 Tier 1 Online Exam Admit Card', 'admit-cards', '28-07-2017', 'Central', 'SSC CGL Tier 1 Online Computer Based Examination 2017 Admit Card.', 'Released', 'Archive', '₹0', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');

// 2016
addJob('adm-2016-rrb-ntpc', 'Railway RRB NTPC 2016 Online CBT Hall Ticket (CEN 03/2015)', 'admit-cards', '15-03-2016', 'Central', 'RRB NTPC 18,252 Posts March-May 2016 Online Exam Call Letter.', 'Released', 'Archive', '₹0', '₹0', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in');


// ==========================================
// 4. ANSWER KEY (2016 - 2026)
// ==========================================
addJob('ans-2026-ssc-cgl', 'SSC CGL 2026 Tier 1 Official Answer Key & Response Sheet', 'answer-key', '20-09-2026', 'Central', 'Staff Selection Commission (SSC) CGL 2026 Tier 1 Provisional Answer Key and Objection Tracker.', 'Key Live', 'Active', '₹0', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');
addJob('ans-2026-uppolice', 'UP Police Constable Re-Exam Official Answer Key 2026', 'answer-key', '11-09-2026', 'Uttar Pradesh', 'UPPRPB UP Police Constable All Shifts Official Master Answer Key & Master Question Paper.', 'Key Live', 'Active', '₹0', '₹0', 'https://uppbpb.gov.in', 'https://uppbpb.gov.in', 'https://uppbpb.gov.in');
addJob('ans-2026-ctet', 'CTET July 2026 Official Answer Key & OMR Sheet Download', 'answer-key', '24-07-2026', 'Central', 'CBSE Central Teacher Eligibility Test Paper 1 & 2 Answer Key with Challenge Link.', 'Released', 'Active', '₹0', '₹0', 'https://ctet.nic.in', 'https://ctet.nic.in', 'https://ctet.nic.in');

// 2025
addJob('ans-2025-ssc-gd', 'SSC GD 2025 Tentative Answer Key & Candidate Response Sheet', 'answer-key', '05-03-2025', 'Central', 'Staff Selection Commission GD Constable 2025 CBT Answer Key.', 'Released', 'Archive', '₹0', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');
addJob('ans-2025-rrb-alp', 'Railway RRB ALP Stage 1 CBT 2025 Official Answer Key', 'answer-key', '28-08-2025', 'Central', 'RRB Assistant Loco Pilot CEN 01/2024 CBT 1 Master Answer Key.', 'Released', 'Archive', '₹0', '₹0', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');

// 2024
addJob('ans-2024-ssc-cgl', 'SSC CGL 2024 Tier 1 Answer Key and Response Sheet', 'answer-key', '04-10-2024', 'Central', 'Staff Selection Commission CGL 2024 Tier 1 Objection Link.', 'Released', 'Archive', '₹0', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');
addJob('ans-2024-bpsc-tre3', 'BPSC School Teacher TRE 3.0 Official Answer Key 2024', 'answer-key', '28-07-2024', 'Bihar', 'BPSC TRE 3.0 Primary, Middle and Secondary Final Answer Key.', 'Released', 'Archive', '₹0', '₹0', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in');

// 2023
addJob('ans-2023-bpsc-tre1', 'BPSC Bihar Teacher TRE 1.0 Provisional & Final Answer Key', 'answer-key', '01-09-2023', 'Bihar', 'BPSC TRE 1.0 All Series Official Master Answer Key.', 'Released', 'Archive', '₹0', '₹0', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in');
addJob('ans-2023-upsssc-vdo', 'UPSSSC VDO 2018 Re-Exam Official Answer Key 2023', 'answer-key', '13-07-2023', 'Uttar Pradesh', 'UPSSSC Gram Panchayat Adhikari VDO 2018 Re-Exam Master Answer Key.', 'Released', 'Archive', '₹0', '₹0', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');

// 2022
addJob('ans-2022-rrb-groupd', 'Railway Group D All Phases Official Answer Key 2022', 'answer-key', '14-10-2022', 'Central', 'RRC 01/2019 Group D CBT Question Paper, Responses & Objection Tracker.', 'Released', 'Archive', '₹0', '₹0', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');
addJob('ans-2022-upsssc-lekhpal', 'UPSSSC Lekhpal 2022 Mains Official Master Answer Key', 'answer-key', '01-08-2022', 'Uttar Pradesh', 'UPSSSC Rajasva Lekhpal 8085 Posts Master Answer Key & Objection Link.', 'Released', 'Archive', '₹0', '₹0', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');

// 2021
addJob('ans-2021-uppolice-si', 'UP Police SI 9534 Posts 2021 Official Answer Key & Objection', 'answer-key', '10-12-2021', 'Uttar Pradesh', 'UPPRPB SI Civil Police Online Exam Question & Answer Key Link.', 'Released', 'Archive', '₹0', '₹0', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in');
addJob('ans-2021-upsssc-pet', 'UPSSSC PET 2021 Shift 1 & Shift 2 Official Master Answer Key', 'answer-key', '31-08-2021', 'Uttar Pradesh', 'UPSSSC PET 2021 Master Question Paper with Official Answer Keys.', 'Released', 'Archive', '₹0', '₹0', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');

// 2020
addJob('ans-2020-delhi-police', 'Delhi Police Constable 2020 Official Answer Key', 'answer-key', '27-12-2020', 'Delhi', 'SSC Delhi Police Constable 2020 Computer Based Exam Answer Key.', 'Released', 'Archive', '₹0', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');

// 2019
addJob('ans-2019-uppolice-49568', 'UP Police 49,568 Constable Official Answer Key 2019', 'answer-key', '02-02-2019', 'Uttar Pradesh', 'UPPRPB 49568 Constable All Shifts Master Answer Key PDF.', 'Released', 'Archive', '₹0', '₹0', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in');

// 2018
addJob('ans-2018-rrb-groupd', 'Railway Group D 2018 Official Answer Key with Question Paper', 'answer-key', '11-01-2019', 'Central', 'RRB CEN 02/2018 Group D CBT Response Sheet & Answer Key.', 'Released', 'Archive', '₹0', '₹0', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in');
addJob('ans-2018-rrb-alp', 'Railway RRB ALP & Technician 2018 Stage 1 Answer Key', 'answer-key', '14-09-2018', 'Central', 'RRB CEN 01/2018 ALP Stage 1 CBT Answer Key and Objection Tracker.', 'Released', 'Archive', '₹0', '₹0', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in');

// 2017
addJob('ans-2017-ssc-cgl', 'SSC CGL 2017 Tier 1 Official Answer Key & Response Sheet', 'answer-key', '07-09-2017', 'Central', 'Staff Selection Commission CGL 2017 Tier 1 Computer Based Exam Key.', 'Released', 'Archive', '₹0', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');

// 2016
addJob('ans-2016-rrb-ntpc', 'Railway RRB NTPC 2016 Stage 1 Answer Key (CEN 03/2015)', 'answer-key', '12-08-2016', 'Central', 'RRB NTPC 2016 CBT Official Question Paper & Response Sheet.', 'Released', 'Archive', '₹0', '₹0', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in');


// ==========================================
// 5. SYLLABUS (2016 - 2026)
// ==========================================
addJob('syl-2026-uppolice', 'UP Police Constable & SI Detailed Exam Pattern & Syllabus 2026', 'syllabus', '15-08-2026', 'Uttar Pradesh', 'Complete Subject-wise Syllabus for General Hindi, Law & Constitution (Mool Vidhi), Numerical & Mental Ability, Mental Aptitude & Reasoning.', 'PDF Available', 'Always Active', '₹0', '₹0', 'https://uppbpb.gov.in', 'https://uppbpb.gov.in', 'https://uppbpb.gov.in');
addJob('syl-2026-ssc-cgl', 'SSC CGL 2026 Tier 1 & Tier 2 New Exam Pattern & Syllabus', 'syllabus', '10-08-2026', 'Central', 'Staff Selection Commission CGL 2026 Complete Scheme of Examination, Module wise Computer Test, Math, English, Reasoning & GA.', 'PDF Available', 'Always Active', '₹0', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');
addJob('syl-2026-rrb-ntpc', 'Railway RRB NTPC 2026 CBT 1 & CBT 2 Detailed Syllabus PDF', 'syllabus', '05-08-2026', 'Central', 'RRB NTPC 2026 Math, General Intelligence & Reasoning, and General Awareness complete syllabus.', 'PDF Available', 'Always Active', '₹0', '₹0', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');
addJob('syl-2026-upsc-cse', 'UPSC Civil Services IAS / IPS Prelims & Mains Syllabus 2026', 'syllabus', '14-02-2026', 'Central', 'Union Public Service Commission CSE 2026 General Studies GS 1 to 4, CSAT, Essay & Optional Subjects Syllabus.', 'PDF Available', 'Always Active', '₹0', '₹0', 'https://upsc.gov.in', 'https://upsc.gov.in', 'https://upsc.gov.in');
addJob('syl-2026-ctet', 'CTET 2026 Paper 1 & Paper 2 Detailed Syllabus & Blueprint', 'syllabus', '15-01-2026', 'Central', 'CBSE Central Teacher Eligibility Test Child Development & Pedagogy, Language, Maths, EVS & Social Science Syllabus.', 'PDF Available', 'Always Active', '₹0', '₹0', 'https://ctet.nic.in', 'https://ctet.nic.in', 'https://ctet.nic.in');

// 2025
addJob('syl-2025-ssc-gd', 'SSC GD Constable 2025 Syllabus & Physical Standards (PST/PET)', 'syllabus', '01-09-2025', 'Central', 'Staff Selection Commission Constable GD 2025 Exam Pattern and 80 Questions Marking Scheme.', 'PDF Available', 'Archive', '₹0', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');
addJob('syl-2025-rrb-alp', 'Railway RRB ALP & Technician 2025 Trade & CBT Syllabus', 'syllabus', '15-01-2025', 'Central', 'RRB Assistant Loco Pilot Basic Science & Engineering, Technical Trade Syllabus.', 'PDF Available', 'Archive', '₹0', '₹0', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');
addJob('syl-2025-upsssc-pet', 'UPSSSC PET 2025 Topic-wise 100 Marks Detailed Syllabus', 'syllabus', '10-06-2025', 'Uttar Pradesh', 'UPSSSC Preliminary Eligibility Test Complete 15 Topics Marks Distribution Syllabus PDF.', 'PDF Available', 'Archive', '₹0', '₹0', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');

// 2024
addJob('syl-2024-bpsc-tre3', 'BPSC Bihar Teacher TRE 3.0 Syllabus (Primary, Middle, Secondary)', 'syllabus', '15-02-2024', 'Bihar', 'BPSC Bihar TRE 3.0 Exam Pattern, Language Qualifying & General Studies Syllabus.', 'PDF Available', 'Archive', '₹0', '₹0', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in');
addJob('syl-2024-rpf-si', 'Railway RPF Sub Inspector & Constable Exam Syllabus 2024', 'syllabus', '15-04-2024', 'Central', 'RPF CEN 01/2024 120 Questions 90 Minutes Detailed Exam Pattern.', 'PDF Available', 'Archive', '₹0', '₹0', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');

// 2023
addJob('syl-2023-ssc-mts', 'SSC MTS & Havaldar 2023 New Session 1 & 2 Syllabus', 'syllabus', '30-06-2023', 'Central', 'SSC MTS Non-Technical New Exam Pattern (No Negative Marking in Session 1).', 'PDF Available', 'Archive', '₹0', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');
addJob('syl-2023-bpsc-tre1', 'BPSC Bihar Teacher TRE 1.0 Complete 1.70 Lakh Vacancy Syllabus', 'syllabus', '15-06-2023', 'Bihar', 'BPSC Education Department Teacher Recruitment Official Syllabus & Pattern.', 'PDF Available', 'Archive', '₹0', '₹0', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in', 'https://bpsc.bih.nic.in');

// 2022
addJob('syl-2022-ssc-cgl', 'SSC CGL 2022 Changed Pattern Tier 1 & Tier 2 Complete Syllabus', 'syllabus', '17-09-2022', 'Central', 'SSC CGL Historic Pattern Change Notification & New Syllabus.', 'PDF Available', 'Archive', '₹0', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');
addJob('syl-2022-up-lekhpal', 'UPSSSC Rajasva Lekhpal 2022 Gram Samaj & Vikas Syllabus', 'syllabus', '08-12-2021', 'Uttar Pradesh', 'UPSSSC Lekhpal 100 Marks (Hindi, Math, GK, Rural Development) Official Syllabus.', 'PDF Available', 'Archive', '₹0', '₹0', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');

// 2021
addJob('syl-2021-uppolice-si', 'UP Police SI 2021 Mool Vidhi, Samvidhan & Reasoning Syllabus', 'syllabus', '01-04-2021', 'Uttar Pradesh', 'UPPRPB 400 Marks SI Examination Detailed Sectional Cutoff Syllabus.', 'PDF Available', 'Archive', '₹0', '₹0', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in');
addJob('syl-2021-upsssc-pet', 'UPSSSC PET 2021 First Official Syllabus and Topic Blueprint', 'syllabus', '25-05-2021', 'Uttar Pradesh', 'UPSSSC Group C Preliminary Eligibility Test Official Guidelines and Blueprint.', 'PDF Available', 'Archive', '₹0', '₹0', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');

// 2020
addJob('syl-2020-delhi-police', 'Delhi Police Constable 2020 Computer Based Exam Syllabus', 'syllabus', '01-08-2020', 'Delhi', 'SSC Delhi Police Constable Computer Fundamentals, Reasoning, Math, GK Syllabus.', 'PDF Available', 'Archive', '₹0', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');

// 2019
addJob('syl-2019-rrb-ntpc', 'Railway RRB NTPC 2019 (CEN 01/2019) Stage 1 & 2 Syllabus', 'syllabus', '01-03-2019', 'Central', 'Railway 35,208 NTPC Posts CBT 1 & CBT 2 Official Exam Scheme.', 'PDF Available', 'Archive', '₹0', '₹0', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');
addJob('syl-2019-rrc-groupd', 'Railway RRC Group D Level 1 (1.03 Lakh Posts) Syllabus', 'syllabus', '12-03-2019', 'Central', 'RRC 01/2019 100 Questions (Science 25, Math 25, Reasoning 30, GA 20) Syllabus.', 'PDF Available', 'Archive', '₹0', '₹0', 'https://rrbapply.gov.in', 'https://indianrailways.gov.in', 'https://rrbapply.gov.in');

// 2018
addJob('syl-2018-rrb-alp', 'Railway RRB ALP & Tech 2018 Part A & Part B Trade Syllabus', 'syllabus', '03-02-2018', 'Central', 'RRB CEN 01/2018 DGET ITI Trade Syllabus and Basic Science & Engineering.', 'PDF Available', 'Archive', '₹0', '₹0', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in');
addJob('syl-2018-uppolice-41520', 'UP Police Constable 2018 300 Marks Written Exam Syllabus', 'syllabus', '22-01-2018', 'Uttar Pradesh', 'UPPRPB 41520 Constable 150 Questions Negative Marking Syllabus.', 'PDF Available', 'Archive', '₹0', '₹0', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in', 'http://uppbpb.gov.in');

// 2017
addJob('syl-2017-ssc-cgl', 'SSC CGL 2017 Scheme of Examination & Tier 1 to 4 Syllabus', 'syllabus', '16-05-2017', 'Central', 'Staff Selection Commission CGL 2017 Tier 1 Online Exam Syllabus.', 'PDF Available', 'Archive', '₹0', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');

// 2016
addJob('syl-2016-rrb-ntpc', 'Railway RRB NTPC 2016 Computer Based Test Exam Pattern', 'syllabus', '26-12-2015', 'Central', 'RRB NTPC CEN 03/2015 100 Marks First Online Examination Syllabus.', 'PDF Available', 'Archive', '₹0', '₹0', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in', 'http://www.rrcb.gov.in');
addJob('syl-2016-ssc-cgl', 'SSC CGL 2016 First Online Exam Detailed Syllabus & Scheme', 'syllabus', '13-02-2016', 'Central', 'Staff Selection Commission 2016 Switch to Online CBT Exam Pattern PDF.', 'PDF Available', 'Archive', '₹0', '₹0', 'https://ssc.nic.in', 'https://ssc.nic.in', 'https://ssc.nic.in');


// ==========================================
// 6. ADMISSION (2016 - 2026)
// ==========================================
addJob('adm-2026-cuet-ug', 'NTA CUET UG 2026 Online Application Form (Central Universities)', 'admission', '27-02-2026', 'Central', 'National Testing Agency Common University Entrance Test CUET UG 2026 for DU, BHU, JNU, AU, JMI.', '27-02-2026', '31-03-2026', '₹1000', '₹900', 'https://exams.nta.ac.in/CUET-UG', 'https://nta.ac.in', 'https://exams.nta.ac.in/CUET-UG');
addJob('adm-2026-up-bed', 'UP B.Ed Combined Entrance Examination JEE B.Ed 2026', 'admission', '10-02-2026', 'Uttar Pradesh', 'Bundelkhand University Jhansi UP B.Ed 2-Year Combined Entrance Examination 2026.', '10-02-2026', '30-04-2026', '₹1400', '₹700', 'https://bujhansi.ac.in', 'https://bujhansi.ac.in', 'https://bujhansi.ac.in');
addJob('adm-2026-jee-main', 'NTA IIT JEE Main 2026 Session 1 & 2 Online Form', 'admission', '01-11-2025', 'Central', 'Joint Entrance Examination JEE Main 2026 for B.Tech / B.Arch in NITs, IIITs, CFTIs.', '01-11-2025', '04-12-2025', '₹1000', '₹500', 'https://jeemain.nta.ac.in', 'https://nta.ac.in', 'https://jeemain.nta.ac.in');
addJob('adm-2026-jeecup', 'UP Polytechnic JEECUP 2026 Online Admission Form', 'admission', '15-01-2026', 'Uttar Pradesh', 'Joint Entrance Examination Council Uttar Pradesh Diploma in Engineering / Pharmacy JEECUP 2026.', '15-01-2026', '10-05-2026', '₹300', '₹200', 'https://jeecup.admissions.nic.in', 'https://jeecup.admissions.nic.in', 'https://jeecup.admissions.nic.in');

// 2025
addJob('adm-2025-cuet-ug', 'NTA CUET UG 2025 Registration & Entrance Examination', 'admission', '27-02-2025', 'Central', 'Common University Entrance Test Undergraduate CUET UG 2025 Admission Form.', '27-02-2025', '26-03-2025', '₹1000', '₹900', 'https://exams.nta.ac.in/CUET-UG', 'https://nta.ac.in', 'https://exams.nta.ac.in/CUET-UG');
addJob('adm-2025-up-bed', 'UP B.Ed JEE 2025 Admission Online Form (BU Jhansi)', 'admission', '10-02-2025', 'Uttar Pradesh', 'Uttar Pradesh B.Ed Combined Entrance Examination JEE 2025.', '10-02-2025', '08-04-2025', '₹1400', '₹700', 'https://bujhansi.ac.in', 'https://bujhansi.ac.in', 'https://bujhansi.ac.in');
addJob('adm-2025-up-deled', 'UP DElEd (BTC) 2025 Online Admission Registration', 'admission', '18-09-2025', 'Uttar Pradesh', 'Examination Regulatory Authority PNP Prayagraj UP DElEd (BTC) 2-Year Training Course 2025.', '18-09-2025', '09-10-2025', '₹700', '₹500', 'https://updeled.gov.in', 'https://updeled.gov.in', 'https://updeled.gov.in');

// 2024
addJob('adm-2024-cuet-ug', 'CUET UG 2024 Online Application Form (NTA)', 'admission', '27-02-2024', 'Central', 'National Testing Agency CUET UG 2024 Admission in 250+ Central, State & Deemed Universities.', '27-02-2024', '31-03-2024', '₹1000', '₹900', 'https://exams.nta.ac.in', 'https://nta.ac.in', 'https://exams.nta.ac.in');
addJob('adm-2024-up-bed', 'UP B.Ed JEE 2024 Admission Online Form', 'admission', '10-02-2024', 'Uttar Pradesh', 'Bundelkhand University UP B.Ed Joint Entrance Exam 2024.', '10-02-2024', '30-04-2024', '₹1400', '₹700', 'https://bujhansi.ac.in', 'https://bujhansi.ac.in', 'https://bujhansi.ac.in');

// 2023
addJob('adm-2023-up-deled', 'UP DElEd BTC 2023 Online Registration (Mega 3 Lakh Candidates)', 'admission', '02-06-2023', 'Uttar Pradesh', 'UP DElEd 2023 2-Year Diploma in Elementary Education Admission.', '02-06-2023', '21-08-2023', '₹700', '₹500', 'https://updeled.gov.in', 'https://updeled.gov.in', 'https://updeled.gov.in');
addJob('adm-2023-up-bed', 'UP B.Ed JEE 2023 Online Admission Form (BU Jhansi)', 'admission', '10-02-2023', 'Uttar Pradesh', 'Bundelkhand University UP B.Ed Entrance Exam 2023.', '10-02-2023', '15-05-2023', '₹1400', '₹700', 'https://bujhansi.ac.in', 'https://bujhansi.ac.in', 'https://bujhansi.ac.in');

// 2022
addJob('adm-2022-cuet-ug', 'CUET UG 2022 (First Year Central University Entrance Exam)', 'admission', '06-04-2022', 'Central', 'First Common University Entrance Test CUET UG 2022 Conducted by NTA.', '06-04-2022', '22-05-2022', '₹650', '₹600', 'https://cuet.samarth.ac.in', 'https://nta.ac.in', 'https://cuet.samarth.ac.in');
addJob('adm-2022-up-bed', 'UP B.Ed JEE 2022 Online Form (MJPRU Bareilly)', 'admission', '18-04-2022', 'Uttar Pradesh', 'MJP Rohilkhand University Bareilly UP B.Ed JEE 2022 Admission.', '18-04-2022', '15-05-2022', '₹1000', '₹500', 'https://mjpru.ac.in', 'https://mjpru.ac.in', 'https://mjpru.ac.in');

// 2021
addJob('adm-2021-up-bed', 'UP B.Ed JEE 2021 Online Form (Lucknow University)', 'admission', '18-02-2021', 'Uttar Pradesh', 'University of Lucknow UP B.Ed Combined Entrance Examination 2021.', '18-02-2021', '24-03-2021', '₹1500', '₹750', 'https://lkouniv.ac.in', 'https://lkouniv.ac.in', 'https://lkouniv.ac.in');

// 2020
addJob('adm-2020-up-bed', 'UP B.Ed Combined Entrance Exam 2020 (Lucknow University)', 'admission', '12-02-2020', 'Uttar Pradesh', 'Lucknow University UP JEE B.Ed 2020 Admission Form.', '12-02-2020', '11-03-2020', '₹1500', '₹750', 'https://lkouniv.ac.in', 'https://lkouniv.ac.in', 'https://lkouniv.ac.in');

// 2019
addJob('adm-2019-up-bed', 'UP B.Ed JEE 2019 Online Form (MJPRU Bareilly)', 'admission', '11-02-2019', 'Uttar Pradesh', 'MJP Rohilkhand University Bareilly UP B.Ed Entrance Exam 2019.', '11-02-2019', '11-03-2019', '₹1500', '₹750', 'https://mjpru.ac.in', 'https://mjpru.ac.in', 'https://mjpru.ac.in');

// 2018
addJob('adm-2018-up-bed', 'UP B.Ed JEE 2018 Online Admission Form (LU)', 'admission', '15-02-2018', 'Uttar Pradesh', 'Lucknow University UP B.Ed Combined Entrance Exam 2018.', '15-02-2018', '15-03-2018', '₹1500', '₹750', 'https://lkouniv.ac.in', 'https://lkouniv.ac.in', 'https://lkouniv.ac.in');

// 2017
addJob('adm-2017-up-bed', 'UP B.Ed JEE 2017 Online Form (Lucknow University)', 'admission', '10-03-2017', 'Uttar Pradesh', 'University of Lucknow UP B.Ed 2-Year Entrance Exam 2017.', '10-03-2017', '05-04-2017', '₹1000', '₹550', 'https://lkouniv.ac.in', 'https://lkouniv.ac.in', 'https://lkouniv.ac.in');

// 2016
addJob('adm-2016-up-bed', 'UP B.Ed Combined Entrance Exam JEE B.Ed 2016 Form', 'admission', '10-02-2016', 'Uttar Pradesh', 'Lucknow University UP B.Ed 2016 Joint Entrance Examination.', '10-02-2016', '10-03-2016', '₹1000', '₹550', 'https://lkouniv.ac.in', 'https://lkouniv.ac.in', 'https://lkouniv.ac.in');


// ==========================================
// 7. DOCUMENTS (CERTIFICATE & SERVICES) (2016 - 2026)
// ==========================================
addJob('doc-2026-up-edistrict', 'UP E-District Caste, Income & Domicile (Jati, Aay, Niwas) Certificate 2026', 'documents', '15-08-2026', 'Uttar Pradesh', 'Uttar Pradesh eDistrict Portal - Online Application for Income Certificate (Aay Praman Patra), Caste Certificate (Jati Praman Patra), and Domicile Certificate (Niwas Praman Patra).', 'Online 24x7', 'Always Active', '₹15', '₹15', 'https://edistrict.up.gov.in', 'https://edistrict.up.gov.in', 'https://edistrict.up.gov.in');
addJob('doc-2026-pan-card', 'NSDL / UTI PAN Card Online Apply, Correction & Instant e-PAN 2026', 'documents', '15-08-2026', 'Central', 'Apply New PAN Card (Form 49A), Correction / Update in Existing PAN, and Instant e-PAN via Aadhar e-KYC in 10 minutes.', 'Active Portal', 'Always Active', '₹107', '₹107', 'https://onlineservices.nsdl.com', 'https://incometax.gov.in', 'https://onlineservices.nsdl.com');
addJob('doc-2026-aadhar-card', 'UIDAI Aadhar Card Download, PVC Card Order & Update 2026', 'documents', '15-08-2026', 'Central', 'Unique Identification Authority of India (UIDAI) - Download Masked/Regular e-Aadhar, Order Secure PVC Card, Check Aadhar-Bank Link Status.', 'Active Portal', 'Always Active', '₹50 (PVC)', '₹0 (Download)', 'https://myaadhaar.uidai.gov.in', 'https://uidai.gov.in', 'https://myaadhaar.uidai.gov.in');
addJob('doc-2026-voter-id', 'ECI Voter ID Card Online Registration (Form 6) & e-EPIC Download 2026', 'documents', '15-08-2026', 'Central', 'Election Commission of India (ECI) Voters Service Portal - New Voter Registration (Form 6), Correction in Voter Card (Form 8), Download Digital e-EPIC PDF.', 'Active Portal', 'Always Active', '₹0', '₹0', 'https://voters.eci.gov.in', 'https://eci.gov.in', 'https://voters.eci.gov.in');
addJob('doc-2026-driving-license', 'Sarathi Parivahan Learning License & Driving License (DL) Online 2026', 'documents', '15-08-2026', 'Central', 'Ministry of Road Transport & Highways - Apply Online Learner License (LL) with Face Auth, Permanent DL, DL Renewal & Duplicate License.', 'Active Portal', 'Always Active', '₹350', '₹350', 'https://sarathi.parivahan.gov.in', 'https://parivahan.gov.in', 'https://sarathi.parivahan.gov.in');
addJob('doc-2026-passport-seva', 'Passport Seva Kendra Online Application & Appointment Booking 2026', 'documents', '15-08-2026', 'Central', 'Ministry of External Affairs (MEA) - Apply Fresh / Re-issue Passport, Tatkaal Passport, Police Clearance Certificate (PCC) Appointment.', 'Active Portal', 'Always Active', '₹1500', '₹1500', 'https://passportindia.gov.in', 'https://passportindia.gov.in', 'https://passportindia.gov.in');
addJob('doc-2026-digilocker', 'DigiLocker Online Document Storage & Verification Service 2026', 'documents', '15-08-2026', 'Central', 'Digital India DigiLocker - Fetch & Store Verified 10th/12th Marksheets, Driving License, Vehicle RC, Caste Certificate, APAAR ID.', 'Active Portal', 'Always Active', '₹0 (Free Govt Service)', '₹0', 'https://digilocker.gov.in', 'https://digilocker.gov.in', 'https://digilocker.gov.in');
addJob('doc-2026-eshram-card', 'E-Shram Card Registration, Download & ₹2 Lakh Insurance 2026', 'documents', '15-08-2026', 'Central', 'Ministry of Labour and Employment - Unorganized Workers UAN Card Online Registration, Profile Update, and Scheme Benefits.', 'Active Portal', 'Always Active', '₹0 (Free)', '₹0', 'https://eshram.gov.in', 'https://eshram.gov.in', 'https://eshram.gov.in');
addJob('doc-2026-pm-kisan', 'PM Kisan Samman Nidhi Yojana e-KYC, Status & New Farmer Registration 2026', 'documents', '15-08-2026', 'Central', 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) ₹6000/Year Benefit - Online e-KYC OTP/Biometric, Beneficiary Status & Installment Check.', 'Active Portal', 'Always Active', '₹0', '₹0', 'https://pmkisan.gov.in', 'https://pmkisan.gov.in', 'https://pmkisan.gov.in');
addJob('doc-2026-bihar-rtps', 'Bihar RTPS Service Plus Jati, Aay, Niwas & Non-Creamy Layer (NCL) 2026', 'documents', '15-08-2026', 'Bihar', 'Bihar RTPS ServicePlus - Online Application for Character Certificate, Residential, Income & Caste Certificate.', 'Online Portal', 'Always Active', '₹0', '₹0', 'https://serviceonline.bihar.gov.in', 'https://serviceonline.bihar.gov.in', 'https://serviceonline.bihar.gov.in');
addJob('doc-2026-hsrp', 'High Security Number Plate (HSRP) & Color Coded Sticker Online Booking', 'documents', '15-08-2026', 'Uttar Pradesh', 'Book-My-HSRP - Online High Security Registration Plate & Color Coded Fuel Sticker Booking with Home Delivery & Dealer Fitment.', 'Active Booking', 'Always Active', '₹365-₹750', '₹365-₹750', 'https://bookmyhsrp.com', 'https://parivahan.gov.in', 'https://bookmyhsrp.com');
addJob('doc-2026-character-cert', 'UP Police Online Character Certificate (Charitra Praman Patra) Verification', 'documents', '15-08-2026', 'Uttar Pradesh', 'CCTNS UP Police Citizen Portal - Apply Online Police Verification Character Certificate for Job & Contract.', 'Online Portal', 'Always Active', '₹50', '₹50', 'https://uppolice.gov.in', 'https://uppolice.gov.in', 'https://uppolice.gov.in');


// ==========================================
// 8. IMPORTANT (SCHEMES & PROFILES) (2016 - 2026)
// ==========================================
addJob('imp-2026-up-nursing', 'UP Nursing Council Registration Online Form 2026', 'important', '15-08-2026', 'Uttar Pradesh', 'Uttar Pradesh Nurses and Midwives Council Online Registration, Renewal & Verification Portal 2026.', '15-08-2026', 'Ongoing', '₹1000', '₹1000', 'https://upnrhm.gov.in', 'https://upnrhm.gov.in', 'https://upnrhm.gov.in');
addJob('imp-2026-nielit-ccc', 'NIELIT CCC Exam Online Form 2026 (Every Month Cycle)', 'important', '15-08-2026', 'All India', 'National Institute of Electronics and Information Technology (NIELIT) Course on Computer Concepts (CCC) Monthly Online Form.', 'First of Month', 'Last of Month', '₹590', '₹590', 'https://student.nielit.gov.in', 'https://nielit.gov.in', 'https://student.nielit.gov.in');
addJob('imp-2026-dsssb-edossier', 'Delhi DSSSB E Dossiers Form Online 2026', 'important', '15-08-2026', 'Delhi', 'Delhi Subordinate Services Selection Board (DSSSB) E-Dossier Document Submission Portal for Shortlisted Candidates.', 'Active', 'Active', '₹0', '₹0', 'https://dsssbonline.nic.in', 'https://dsssb.delhi.gov.in', 'https://dsssbonline.nic.in');
addJob('imp-2026-up-self-enum', 'UP Self Enumeration Online Registration 2026 Last Date : 21/05/2026', 'important', '15-08-2026', 'Uttar Pradesh', 'Uttar Pradesh Self Enumeration Census and Citizen Survey Portal.', '01-01-2026', '21-05-2026', '₹0', '₹0', 'https://censusindia.gov.in', 'https://censusindia.gov.in', 'https://censusindia.gov.in');
addJob('imp-2025-mp-rojgar', 'MP Rojgar Panjiyan Online Registration 2025', 'important', '15-08-2025', 'Madhya Pradesh', 'Madhya Pradesh Employment Portal MP Rojgar Panjiyan Card for State Govt Job Applicants.', 'Online Portal', 'Ongoing', '₹0', '₹0', 'https://mprojgar.gov.in', 'https://mprojgar.gov.in', 'https://mprojgar.gov.in');
addJob('imp-2024-up-scholarship', 'UP Scholarship Online Form 2024 Last Date : 31/12/2024', 'important', '15-08-2024', 'Uttar Pradesh', 'Social Welfare Department Uttar Pradesh Pre-Matric Class 9-10 & Post-Matric Class 11-12, Dashmottar Scholarship 2024-2025.', '01-07-2024', '31-12-2024', '₹0', '₹0', 'https://scholarship.up.gov.in', 'https://scholarship.up.gov.in', 'https://scholarship.up.gov.in');
addJob('imp-2024-ssc-otr', 'SSC One Time Registration OTR Online Form 2024', 'important', '15-08-2024', 'All India', 'Staff Selection Commission New Portal (ssc.gov.in) Mandatory One Time Registration OTR for All SSC Exams.', 'Active Portal', 'Ongoing', '₹0', '₹0', 'https://ssc.gov.in', 'https://ssc.gov.in', 'https://ssc.gov.in');
addJob('imp-2024-voter-id-epic', 'Voter ID Online Form 2024, E EPIC Download', 'important', '15-08-2024', 'All India', 'Election Commission of India National Voter Services Portal (NVSP) New Registration & e-EPIC Download.', 'Active Portal', 'Ongoing', '₹0', '₹0', 'https://voters.eci.gov.in', 'https://eci.gov.in', 'https://voters.eci.gov.in');
addJob('imp-2023-har-ghar-tiranga', 'Har Ghar Tiranga Abhiyan 2023 Certificate Download', 'important', '13-08-2023', 'All India', 'Ministry of Culture Azadi Ka Amrit Mahotsav Har Ghar Tiranga Online Certificate Generation.', '13-08-2023', '15-08-2023', '₹0', '₹0', 'https://harghartiranga.com', 'https://harghartiranga.com', 'https://harghartiranga.com');
addJob('imp-2023-sahara-refund', 'Sahara Refund Portal Online Registration 2023 (CRCS)', 'important', '18-07-2023', 'All India', 'Central Registrar of Cooperative Societies (CRCS) Sahara Depositors Online Claim Refund Portal.', '18-07-2023', 'Ongoing', '₹0', '₹0', 'https://mocrefund.crcs.gov.in', 'https://cooperation.gov.in', 'https://mocrefund.crcs.gov.in');
addJob('imp-2023-up-family-id', 'UP Family ID Ek Parivar Ek Pahchan Scheme Online Registration 2023', 'important', '10-02-2023', 'Uttar Pradesh', 'Government of Uttar Pradesh Family ID One Family One Identity 12-Digit Unique Card Portal.', 'Online Portal', 'Ongoing', '₹0', '₹0', 'https://familyid.up.gov.in', 'https://up.gov.in', 'https://familyid.up.gov.in');
addJob('imp-2023-mpesb-profile', 'MPESB Profile Online Registration 2023 (Candidate Profile)', 'important', '15-01-2023', 'Madhya Pradesh', 'MP Employees Selection Board (Vyapam) Candidate Profile Creation & Aadhar e-KYC Portal.', 'Online Portal', 'Ongoing', '₹0', '₹0', 'https://esb.mp.gov.in', 'https://esb.mp.gov.in', 'https://esb.mp.gov.in');
addJob('imp-2022-up-fellowship', 'UP Mukhyamantri Fellowship Programme Online Form 2022', 'important', '10-08-2022', 'Uttar Pradesh', 'Uttar Pradesh Urban Development Planning Department CM Fellowship ₹40,000/Month.', '10-08-2022', '24-08-2022', '₹0', '₹0', 'https://cmfellowship.up.gov.in', 'https://up.gov.in', 'https://cmfellowship.up.gov.in');
addJob('imp-2022-har-ghar-tiranga', 'Har Ghar Tiranga Abhiyan Online Registration 2022', 'important', '01-08-2022', 'All India', '75th Independence Day Azadi Ka Amrit Mahotsav Har Ghar Tiranga Registration.', '01-08-2022', '15-08-2022', '₹0', '₹0', 'https://harghartiranga.com', 'https://harghartiranga.com', 'https://harghartiranga.com');
addJob('imp-2022-up-scholarship', 'UP Scholarship Online Form 2022 (Class 9, 10, 11, 12, Dashmottar)', 'important', '08-07-2022', 'Uttar Pradesh', 'UP Social Welfare Department 2022-2023 Pre & Post Matric Scholarship Portal.', '08-07-2022', '10-12-2022', '₹0', '₹0', 'https://scholarship.up.gov.in', 'https://scholarship.up.gov.in', 'https://scholarship.up.gov.in');
addJob('imp-2022-voter-slip', 'UP Election 2022 Voter Slip Download & Polling Booth Search', 'important', '05-01-2022', 'Uttar Pradesh', 'UP Vidhan Sabha General Election 2022 Online Voter Slip & Booth Navigator.', '05-01-2022', '10-03-2022', '₹0', '₹0', 'https://ceouttarpradesh.nic.in', 'https://eci.gov.in', 'https://ceouttarpradesh.nic.in');
addJob('imp-2022-aadhar-pvc', 'Aadhar Card Download | Appointment Book | Update | PVC Order 2022', 'important', '15-01-2022', 'All India', 'UIDAI MyAadhaar Portal - Order Waterproof PVC Aadhar Card & Download Digital e-Aadhaar.', 'Active Portal', 'Ongoing', '₹50', '₹0', 'https://myaadhaar.uidai.gov.in', 'https://uidai.gov.in', 'https://myaadhaar.uidai.gov.in');
addJob('imp-2022-eshram-reg', 'E Shram Card Online Registration 2022 (₹2 Lakh Accidental Cover)', 'important', '01-01-2022', 'All India', 'National Database of Unorganized Workers (NDUW) e-Shram Registration Portal.', 'Active Portal', 'Ongoing', '₹0', '₹0', 'https://eshram.gov.in', 'https://eshram.gov.in', 'https://eshram.gov.in');
addJob('imp-2021-up-scholarship', 'UP Scholarship 2021 Online Form Last Date : 21/10/2021', 'important', '20-07-2021', 'Uttar Pradesh', 'Uttar Pradesh Scholarship & Fee Reimbursement Online System 2021-2022.', '20-07-2021', '21-10-2021', '₹0', '₹0', 'https://scholarship.up.gov.in', 'https://scholarship.up.gov.in', 'https://scholarship.up.gov.in');
addJob('imp-2021-up-teacher-transfer', 'UP Teacher Transfer Online Form 2021 Last Date : 02/07/2021', 'important', '18-06-2021', 'Uttar Pradesh', 'UP Basic Education Parishad Inter-District Primary Teacher Transfer Portal 2021.', '18-06-2021', '02-07-2021', '₹0', '₹0', 'http://upbasiceduparishad.gov.in', 'http://upbasiceduparishad.gov.in', 'http://upbasiceduparishad.gov.in');
addJob('imp-2021-hsrp-reg', 'High Security Number Plate HSRP Online Registration 2021', 'important', '01-05-2021', 'All India', 'Mandatory High Security Registration Plates (HSRP) and Colour Coded Stickers Booking.', 'Active Portal', 'Ongoing', '₹365-₹750', '₹365-₹750', 'https://bookmyhsrp.com', 'https://parivahan.gov.in', 'https://bookmyhsrp.com');
addJob('imp-2021-upsssc-otr', 'UPSSSC OTR Registration Online Form 2021 (e-Pariksha)', 'important', '27-03-2021', 'Uttar Pradesh', 'UPSSSC One Time Registration (OTR) Portal for Group C Examination Candidates.', 'Active Portal', 'Ongoing', '₹0', '₹0', 'http://upsssc.gov.in', 'http://upsssc.gov.in', 'http://upsssc.gov.in');
addJob('imp-2021-corona-vaccine', 'Corona Vaccine Online Registration 2021 (CoWIN Portal)', 'important', '01-03-2021', 'All India', 'Ministry of Health & Family Welfare CoWIN - COVID-19 Vaccine Slot Booking & Certificate Download.', '01-03-2021', '31-12-2022', '₹0', '₹0', 'https://cowin.gov.in', 'https://cowin.gov.in', 'https://cowin.gov.in');
addJob('imp-2020-up-ntse', 'UP NTSE Online Form 2020 Last Date : 10/11/2020', 'important', '10-10-2020', 'Uttar Pradesh', 'National Talent Search Examination (NTSE) Stage 1 Uttar Pradesh Scholarship Examination 2020.', '10-10-2020', '10-11-2020', '₹0', '₹0', 'https://entdata.co.in', 'https://entdata.co.in', 'https://entdata.co.in');
addJob('imp-2020-mp-rojgar', 'MP Rojgar Panjiyan Online Form 2020', 'important', '01-05-2020', 'Madhya Pradesh', 'Madhya Pradesh Employment Exchange Online Candidate Registration Portal 2020.', 'Online Portal', 'Ongoing', '₹0', '₹0', 'https://mprojgar.gov.in', 'https://mprojgar.gov.in', 'https://mprojgar.gov.in');
addJob('imp-2020-up-scholarship', 'UP Scholarship Class 9 to 12 Online Form 2020', 'important', '01-08-2020', 'Uttar Pradesh', 'UP Social Welfare Pre-Matric & Post-Matric Scholarship Portal 2020-2021.', '01-08-2020', '05-11-2020', '₹0', '₹0', 'https://scholarship.up.gov.in', 'https://scholarship.up.gov.in', 'https://scholarship.up.gov.in');
addJob('imp-2020-ccc-cert', 'CCC Result, Admit Card, Certificate, Online Form NIELIT', 'important', '01-01-2020', 'All India', 'NIELIT Student Portal - CCC Online Form, Download Admit Card, Check Result & Download Digitally Signed Certificate.', 'Active Portal', 'Ongoing', '₹590', '₹590', 'https://student.nielit.gov.in', 'https://nielit.gov.in', 'https://student.nielit.gov.in');
addJob('imp-2020-up-learning-license', 'UP Learning License Online Form 2020 (Sarathi Parivahan)', 'important', '01-06-2020', 'Uttar Pradesh', 'Sarathi Parivahan UP Learner License Online Application & Online Test Slot Booking.', 'Active Portal', 'Ongoing', '₹350', '₹350', 'https://sarathi.parivahan.gov.in', 'https://parivahan.gov.in', 'https://sarathi.parivahan.gov.in');
addJob('imp-2020-up-bar-declaration', 'UP Bar Declaration Online Form (Bar Council of UP)', 'important', '15-09-2020', 'Uttar Pradesh', 'Bar Council of Uttar Pradesh Advocate Verification & Declaration Form Online.', '15-09-2020', '15-11-2020', '₹0', '₹0', 'https://barcouncilofuttarpradesh.org', 'https://barcouncilofuttarpradesh.org', 'https://barcouncilofuttarpradesh.org');

console.log(`Generated ${jobs.length} comprehensive historical & active jobs!`);

const fileContent = `import { JobAlert } from '../types';

export const historicalJobsDatabase: JobAlert[] = ${JSON.stringify(jobs, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/historicalJobs.ts'), fileContent, 'utf8');
console.log('Successfully wrote src/data/historicalJobs.ts');
