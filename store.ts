
import { User, Attendance, Expense, Advance, Project, Role, Status } from './types';

export interface AppConfig {
  googleScriptUrl: string;
  driveFolderUrl: string;
}

export interface AppData {
  users: User[];
  attendance: Attendance[];
  expenses: Expense[];
  advances: Advance[];
  projects: Project[];
  config: AppConfig;
}

const STORAGE_KEY = 'swm_pro_v7_final';

export const DEFAULT_ADMIN: User = { 
  id: '1', 
  userId: '1', 
  name: 'System Admin', 
  passportIc: 'ADMIN-001', 
  password: '8632', 
  basicSalary: 0, 
  project: 'Cloud Control', 
  role: Role.ADMIN, 
  isFrozen: false 
};

const DEFAULT_DATA: AppData = {
  users: [DEFAULT_ADMIN],
  attendance: [],
  expenses: [],
  advances: [],
  projects: [
    { id: '1', name: 'Main Site' },
    { id: '2', name: 'Project Alpha' },
    { id: '3', name: 'Site B' }
  ],
  config: { 
    googleScriptUrl: '',
    driveFolderUrl: ''
  }
};

export const useStore = () => {
  const getLocalData = (): AppData => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_DATA;
    try {
      const parsed = JSON.parse(stored);
      if (!parsed.users || parsed.users.length === 0) {
        parsed.users = [DEFAULT_ADMIN];
      }
      return parsed;
    } catch (e) {
      return DEFAULT_DATA;
    }
  };

  const fetchData = async (): Promise<AppData> => {
    const local = getLocalData();
    const url = local.config.googleScriptUrl;
    if (!url || !url.startsWith('https://script.google.com')) return local;
    
    try {
      const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}action=read&t=${Date.now()}`);
      if (!response.ok) throw new Error("Server error");
      const cloudData = await response.json();
      
      if (cloudData && Array.isArray(cloudData.users)) {
        const hasAdmin = cloudData.users.some((u: any) => u.userId === '1' || u.userId === 1);
        const finalUsers = hasAdmin ? cloudData.users : [DEFAULT_ADMIN, ...cloudData.users];
        
        const merged: AppData = { 
          ...local, 
          users: finalUsers,
          attendance: cloudData.attendance || [],
          expenses: cloudData.expenses || [],
          advances: cloudData.advances || [],
          config: local.config 
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
      return local;
    } catch (error) { 
      return local; 
    }
  };

  const syncData = async (newData: AppData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    window.dispatchEvent(new CustomEvent('app-data-updated', { detail: newData }));
    const url = newData.config.googleScriptUrl;
    if (url && url.startsWith('https://script.google.com')) {
      try {
        await fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'update', data: newData })
        });
      } catch (e) {}
    }
  };

  return {
    getData: fetchData,
    save: syncData,
    getLocal: getLocalData,
    update: async (partial: Partial<AppData>) => {
      const current = getLocalData();
      const updated = { ...current, ...partial };
      await syncData(updated);
    }
  };
};

export const SINGLE_FILE_BACKEND = `
/**
 * SWM PRO - STABLE CLOUD DATABASE ENGINE (Code.gs)
 */

function doGet(e) {
  try {
    if (e.parameter.action === 'read') {
      var data = readEverything();
      return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
    }

    return HtmlService.createHtmlOutput(
      '<div style="font-family:sans-serif; text-align:center; padding: 50px; background:#0f172a; color:white; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center;">' +
      '<h1 style="color:#3b82f6; font-style:italic; font-size:40px; margin-bottom:10px;">SWM PRO</h1>' +
      '<div style="background:#1e293b; padding:30px; border-radius:24px; border:1px solid #334155; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">' +
      '<p style="color:#10b981; font-weight:bold; font-size:20px;">DATABASE IS ONLINE ✅</p>' +
      '<p style="color:#94a3b8; font-size:14px; max-width:300px;">এটি আপনার ডাটাবেজ লিঙ্ক। এটি অ্যাপের <b>Settings</b> এ সেভ করুন।</p>' +
      '</div></div>'
    ).setTitle('SWM PRO Database');
  } catch(err) {
    return ContentService.createTextOutput("Error: " + err.toString());
  }
}

function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    if (params.action === 'update') {
      var data = params.data;
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      if (!ss) return ContentService.createTextOutput("Error: No Spreadsheet");

      // Save Users
      var ws = ss.getSheetByName('Workers_List') || ss.insertSheet('Workers_List');
      ws.clear();
      ws.appendRow(['ID', 'Name', 'Passport', 'Password', 'Salary', 'Role', 'Project']);
      data.users.forEach(function(u) {
        ws.appendRow([u.userId, u.name, u.passportIc, u.password, u.basicSalary, u.role, u.project]);
      });

      // Save Attendance
      var as = ss.getSheetByName('Attendance') || ss.insertSheet('Attendance');
      as.clear();
      as.appendRow(['Date', 'User ID', 'In', 'Out', 'Status', 'Work']);
      data.attendance.forEach(function(a) {
        as.appendRow([a.date, a.userId, a.inTime, a.outTime, a.status, a.workDescription]);
      });

      return ContentService.createTextOutput("Success");
    }
  } catch(e) { return ContentService.createTextOutput("Error: " + e.toString()); }
}

function readEverything() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var users = [];
  var attendance = [];
  
  users.push({ id: '1', userId: '1', name: 'System Admin', password: '8632', role: 'Admin', basicSalary: 0, project: 'Main' });

  if (ss) {
    var ws = ss.getSheetByName('Workers_List');
    if (ws) {
      var wv = ws.getDataRange().getValues();
      for (var i = 1; i < wv.length; i++) {
        if (!wv[i][0] || wv[i][0].toString() === '1') continue;
        users.push({
          id: wv[i][0].toString(),
          userId: wv[i][0].toString(),
          name: wv[i][1] || '',
          passportIc: wv[i][2] || '',
          password: wv[i][3] ? wv[i][3].toString() : '',
          basicSalary: wv[i][4] || 0,
          role: wv[i][5] || 'Worker',
          project: wv[i][6] || 'Main'
        });
      }
    }
  }
  return { users: users, attendance: attendance };
}
`;
