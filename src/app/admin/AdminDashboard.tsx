'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Lead } from '@/lib/lead';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);

  const loadLeads = async () => {
    const res = await fetch('/api/admin/leads');
    if (res.ok) {
      const data = await res.json();
      setLeads(data.leads || []);
      setAuthed(true);
    } else {
      setAuthed(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    // جلب الطلبات عند فتح اللوحة (عملية شبكية، التحديث يقع بعد انتهاء الطلب).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- جلب بيانات عند التحميل
    loadLeads();
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setPassword('');
      await loadLeads();
    } else if (res.status === 503) {
      setError('لم يتم ضبط ADMIN_PASSWORD في إعدادات الخادم.');
    } else {
      setError('كلمة المرور غير صحيحة.');
    }
  };

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    setAuthed(false);
    setLeads([]);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.empty}>جارٍ التحميل...</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className={styles.page}>
        <form className={styles.loginCard} onSubmit={login}>
          <Image src="/logo_transparent.png" alt="ATHR" width={444} height={456} className={styles.logo} />
          <h1 className={styles.title}>لوحة تحكم أثر</h1>
          {error && <p className={styles.error}>{error}</p>}
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            autoFocus
          />
          <button className={styles.btn} type="submit">دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.heading}>طلبات العملاء</h1>
            <span className={styles.count}>{leads.length} طلب</span>
          </div>
          <button className={styles.logout} onClick={logout}>تسجيل الخروج</button>
        </div>

        <div className={styles.tableWrap}>
          {leads.length === 0 ? (
            <p className={styles.empty}>لا توجد طلبات بعد.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>الاسم</th>
                  <th>الجوال</th>
                  <th>البريد</th>
                  <th>النوع</th>
                  <th>المصدر</th>
                  <th>التفاصيل</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td>{new Date(l.createdAt).toLocaleString('ar')}</td>
                    <td>{l.name}</td>
                    <td dir="ltr">{l.phone}</td>
                    <td dir="ltr">{l.email || '-'}</td>
                    <td><span className={styles.badge}>{l.projectType}</span></td>
                    <td>{l.source}</td>
                    <td style={{ maxWidth: 280 }}>{l.details || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
