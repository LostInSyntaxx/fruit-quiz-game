# 🚀 Deploy Backend บน Render.com - คู่มือง่ายๆ

## ขั้นตอนที่ 1: Push Code ขึ้น GitHub

1. สร้าง GitHub Repository ใหม่
2. Push โค้ดทั้งหมดขึ้น GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## ขั้นตอนที่ 2: Deploy บน Render.com

1. ไปที่ https://render.com
2. Sign up/Login ด้วย GitHub
3. คลิก **"New +"** → **"Web Service"**
4. เลือก repository ของคุณ
5. ตั้งค่า:
   - **Name:** fruit-quiz-server
   - **Region:** Oregon (ฟรี)
   - **Branch:** main
   - **Root Directory:** server
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Instance Type:** Free

6. เพิ่ม Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `DISCORD_CLIENT_ID` = `1110932767430160386`
   - `DISCORD_CLIENT_SECRET` = `f0dDKz7YNgFK0KRnWhfMv0Vc7giyDzOj`
   - `DISCORD_REDIRECT_URI` = `https://your-backend-url.onrender.com/api/auth/discord/callback`
   - `FRONTEND_URL` = `https://frontend-taupe-five-10.vercel.app`

7. คลิก **"Create Web Service"**
8. รอ 2-3 นาทีให้ deploy เสร็จ

## ขั้นตอนที่ 3: อัพเดต Frontend

หลังจากได้ backend URL จาก Render แล้ว ให้ไปแก้ไฟล์:

`frontend/.env`

เปลี่ยนจาก:
```
VITE_API_URL=http://localhost:3001
```

เป็น:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

แล้ว deploy frontend ใหม่:
```bash
bun .vercel-tmp/vercel-deploy.cjs
```

## ✅ เสร็จแล้ว!

ตอนนี้คุณสามารถ:
- ส่งลิงก์ frontend ให้เพื่อน
- เพื่อนสามารถเข้าร่วมห้องและเล่นด้วยกันได้
- เล่นได้จากที่ไหนก็ได้!

## 🎮 วิธีเล่น

1. เปิด https://frontend-taupe-five-10.vercel.app
2. สร้างห้องหรือเข้าร่วมห้อง
3. แชร์ room code ให้เพื่อน
4. เริ่มเกมและสนุก!
