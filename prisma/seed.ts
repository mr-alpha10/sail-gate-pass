// Prisma Seed File - Creates demo users and departments
// Run with: npx tsx prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.otpLog.deleteMany()
  await prisma.application.deleteMany()
  await prisma.user.deleteMany()
  await prisma.department.deleteMany()

  // Create departments
  console.log('🏢 Creating departments...')
  const departments = await Promise.all([
    prisma.department.create({ data: { name: 'HR' } }),
    prisma.department.create({ data: { name: 'IT' } }),
    prisma.department.create({ data: { name: 'Finance' } }),
    prisma.department.create({ data: { name: 'Operations' } }),
    prisma.department.create({ data: { name: 'Marketing' } }),
  ])
  console.log(`   ✅ Created ${departments.length} departments`)

  // Hash the demo password
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create demo users (all verified and profile completed)
  console.log('👥 Creating demo users...')
  
  const demoUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Demo User',
      phone: '+1234567890',
      password: hashedPassword,
      role: 'user',
      emailVerified: true,
      profileCompleted: true,
      dateOfBirth: '1990-01-15',
      gender: 'male',
      governmentIdType: 'aadhaar',
      governmentIdNumber: '123456789012',
      address: '123 Demo Street',
      city: 'Ranchi',
      state: 'Jharkhand',
      pincode: '834002',
      emergencyContactName: 'Emergency Contact',
      emergencyContactPhone: '9876543210',
      emergencyContactRelation: 'spouse',
    },
  })
  console.log(`   ✅ Created user: ${demoUser.email}`)

  const securityUser = await prisma.user.create({
    data: {
      email: 'security@company.com',
      name: 'Security Admin',
      phone: '+1234567891',
      password: hashedPassword,
      role: 'security',
      emailVerified: true,
      profileCompleted: true,
      dateOfBirth: '1985-05-20',
      gender: 'male',
      governmentIdType: 'pan',
      governmentIdNumber: 'ABCDE1234F',
      address: 'Security Office, SAIL Complex',
      city: 'Ranchi',
      state: 'Jharkhand',
      pincode: '834002',
      emergencyContactName: 'Emergency Contact',
      emergencyContactPhone: '9876543211',
      emergencyContactRelation: 'parent',
    },
  })
  console.log(`   ✅ Created security: ${securityUser.email}`)

  const hrAdmin = await prisma.user.create({
    data: {
      email: 'hr@company.com',
      name: 'HR Admin',
      phone: '+1234567892',
      password: hashedPassword,
      role: 'department_admin',
      department: 'HR',
      emailVerified: true,
      profileCompleted: true,
      dateOfBirth: '1988-08-10',
      gender: 'female',
      governmentIdType: 'aadhaar',
      governmentIdNumber: '234567890123',
      address: 'HR Department, SAIL Office',
      city: 'Ranchi',
      state: 'Jharkhand',
      pincode: '834002',
      emergencyContactName: 'Emergency Contact',
      emergencyContactPhone: '9876543212',
      emergencyContactRelation: 'sibling',
    },
  })
  console.log(`   ✅ Created HR admin: ${hrAdmin.email}`)

  const itAdmin = await prisma.user.create({
    data: {
      email: 'it@company.com',
      name: 'IT Admin',
      phone: '+1234567893',
      password: hashedPassword,
      role: 'department_admin',
      department: 'IT',
      emailVerified: true,
      profileCompleted: true,
      dateOfBirth: '1992-03-25',
      gender: 'male',
      governmentIdType: 'driving_license',
      governmentIdNumber: 'JH0120200012345',
      address: 'IT Department, SAIL Office',
      city: 'Ranchi',
      state: 'Jharkhand',
      pincode: '834002',
      emergencyContactName: 'Emergency Contact',
      emergencyContactPhone: '9876543213',
      emergencyContactRelation: 'friend',
    },
  })
  console.log(`   ✅ Created IT admin: ${itAdmin.email}`)

  const financeAdmin = await prisma.user.create({
    data: {
      email: 'finance@company.com',
      name: 'Finance Admin',
      phone: '+1234567894',
      password: hashedPassword,
      role: 'department_admin',
      department: 'Finance',
      emailVerified: true,
      profileCompleted: true,
      dateOfBirth: '1987-11-30',
      gender: 'female',
      governmentIdType: 'passport',
      governmentIdNumber: 'J1234567',
      address: 'Finance Department, SAIL Office',
      city: 'Ranchi',
      state: 'Jharkhand',
      pincode: '834002',
      emergencyContactName: 'Emergency Contact',
      emergencyContactPhone: '9876543214',
      emergencyContactRelation: 'parent',
    },
  })
  console.log(`   ✅ Created Finance admin: ${financeAdmin.email}`)

  // Create a sample application for testing
  console.log('📝 Creating sample application...')
  const sampleApp = await prisma.application.create({
    data: {
      userId: demoUser.id,
      userName: demoUser.name,
      userEmail: demoUser.email,
      userPhone: demoUser.phone,
      purpose: 'Meeting with HR team for onboarding discussion',
      department: 'HR',
      visitDate: '2026-02-15',
      visitTime: '10:00',
      duration: '2 hours',
      status: 'pending',
    },
  })
  console.log(`   ✅ Created sample application: #${sampleApp.id}`)

  console.log('')
  console.log('✨ Database seeded successfully!')
  console.log('')
  console.log('📋 Demo Credentials:')
  console.log('┌─────────────────┬─────────────────────────┬─────────────┐')
  console.log('│ Role            │ Email                   │ Password    │')
  console.log('├─────────────────┼─────────────────────────┼─────────────┤')
  console.log('│ User            │ user@example.com        │ password123 │')
  console.log('│ Security        │ security@company.com    │ password123 │')
  console.log('│ HR Admin        │ hr@company.com          │ password123 │')
  console.log('│ IT Admin        │ it@company.com          │ password123 │')
  console.log('│ Finance Admin   │ finance@company.com     │ password123 │')
  console.log('└─────────────────┴─────────────────────────┴─────────────┘')
  console.log('')
  console.log('🆕 To test the NEW registration flow:')
  console.log('   1. Go to /register and create a new account')
  console.log('   2. Check the terminal for the OTP code')
  console.log('   3. Enter the OTP on the verification page')
  console.log('   4. Complete your profile with additional details')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
