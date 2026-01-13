
import React, { useState, useRef } from 'react';
import { useStore, AppData } from '../store';
import { User, Status, Attendance, Role } from '../types';

interface Props {
  activeTab: string;
  user: User;
  t: (key: any) => string;
  appData: AppData;
}

const UserDashboard: React.FC<Props> = ({ activeTab, user, t, appData }) => {
  const store = useStore();
  const [workDesc, setWorkDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const todayAttendance = appData.attendance.find(a => 
    a.userId === user.userId && 
    new Date(a.date).toLocaleDateString() === new Date().toLocaleDateString()
  );

  const watermarkImage = async (file: File, type: 'IN' | 'OUT'): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return resolve(e.target?.result as string);
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(e.target?.result as string);
          ctx.drawImage(img, 0, 0);
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(0, canvas.height-100, canvas.width, 100);
          ctx.fillStyle = "white";
          ctx.font = "bold 30px Inter";
          ctx.fillText(`${type}: ${user.name} | ${new Date().toLocaleString()}`, 50, canvas.height-40);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleStartWork = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = fileInputRef.current?.files?.[0];
    if (!fileInput) return alert("Please capture a photo first!");
    
    setIsSubmitting(true);
    try {
      const watermarked = await watermarkImage(fileInput, 'IN');
      const newAtt: Attendance = {
        id: Date.now().toString(),
        userId: user.userId,
        date: new Date().toLocaleDateString(),
        inTime: new Date().toLocaleTimeString(),
        status: Status.PENDING,
        workDescription: workDesc,
        photoIn: watermarked,
        project: user.project,
        hoursWorked: 0
      };
      
      const updatedAttendance = [...appData.attendance, newAtt];
      await store.update({ attendance: updatedAttendance });
      alert("Shift started successfully! ✅");
    } catch (err) {
      alert("Submission Error!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (activeTab === 'dashboard') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl">
          <p className="text-[10px] font-black uppercase text-blue-400">Security Clearance</p>
          <h2 className="text-3xl font-black mt-2">{user.name}</h2>
          <p className="text-xs mt-2 opacity-50">{user.role} | {user.project}</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-10">
          {!todayAttendance ? (
            <form onSubmit={handleStartWork} className="space-y-8">
              <textarea 
                className="w-full bg-slate-50 border-2 rounded-[1.5rem] p-6 focus:border-blue-500 outline-none h-32 font-bold" 
                placeholder="What is your plan for today?" 
                value={workDesc}
                onChange={e => setWorkDesc(e.target.value)}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col items-center justify-center h-64 bg-slate-50 border-2 border-dashed rounded-[2rem] cursor-pointer overflow-hidden">
                  {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <span className="text-4xl">📸</span>}
                  <input ref={fileInputRef} type="file" accept="image/*" capture="user" className="hidden" onChange={handlePhotoSelect} />
                </label>
                <div className="flex flex-col justify-center bg-blue-50 p-8 rounded-[2rem] text-sm font-bold text-blue-700">
                   Capture your face at project site to start shift.
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xl shadow-xl shadow-blue-200 disabled:opacity-50"
              >
                {isSubmitting ? 'UPLOADING...' : 'START SHIFT ⚡'}
              </button>
            </form>
          ) : (
            <div className="py-20 text-center">
              <div className="text-6xl mb-6">✅</div>
              <h4 className="text-3xl font-black text-slate-800">Working Now</h4>
              <p className="text-slate-400 mt-2 font-bold">Shift started at {todayAttendance.inTime}</p>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  return <div className="p-10 text-center font-black text-slate-300 italic">Section Loading...</div>;
};

export default UserDashboard;
