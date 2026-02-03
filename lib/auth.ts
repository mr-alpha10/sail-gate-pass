import { cookies } from "next/headers"
import prisma from "./prisma"
import bcrypt from "bcryptjs"
import type { User } from "./types"

// Authenticate user with email and password
export async function authenticate(email: string, password: string): Promise<{
  user: User | null
  emailVerified?: boolean
  profileCompleted?: boolean
  error?: string
}> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      console.log("❌ User not found:", email)
      return { user: null, error: "Invalid email or password" }
    }

    // Compare password with hashed password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      console.log("❌ Invalid password for:", email)
      return { user: null, error: "Invalid email or password" }
    }

    console.log("✅ User authenticated:", email)
    console.log("   Email verified:", user.emailVerified)
    console.log("   Profile completed:", user.profileCompleted)
    
    // Return user with verification status
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role as "user" | "security" | "department_admin",
        department: user.department || undefined,
        createdAt: user.createdAt,
      },
      emailVerified: user.emailVerified,
      profileCompleted: user.profileCompleted,
    }
  } catch (error) {
    console.error("❌ Authentication error:", error)
    return { user: null, error: "Authentication failed" }
  }
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get("user")
    
    if (!userCookie) {
      return null
    }

    const userData = JSON.parse(userCookie.value)
    
    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: userData.id },
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role as "user" | "security" | "department_admin",
      department: user.department || undefined,
      createdAt: user.createdAt,
    }
  } catch (error) {
    console.error("❌ Error getting current user:", error)
    return null
  }
}

// Set user session cookie
export async function setUserSession(user: User) {
  const cookieStore = await cookies()
  cookieStore.set("user", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })
}

// Clear user session
export async function clearUserSession() {
  const cookieStore = await cookies()
  cookieStore.delete("user")
}

// Create new user
export async function createUser(userData: {
  name: string
  email: string
  phone: string
  role: "user" | "security" | "department_admin"
  department?: string
  password: string
}): Promise<User | null> {
  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email.toLowerCase() },
    })

    if (existingUser) {
      console.log("❌ Email already exists:", userData.email)
      return null
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        email: userData.email.toLowerCase(),
        name: userData.name,
        phone: userData.phone,
        password: hashedPassword,
        role: userData.role,
        department: userData.department || null,
      },
    })

    console.log("✅ User created:", newUser.email)

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role as "user" | "security" | "department_admin",
      department: newUser.department || undefined,
      createdAt: newUser.createdAt,
    }
  } catch (error) {
    console.error("❌ Error creating user:", error)
    return null
  }
}

// Check if email exists
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })
    return !!user
  } catch (error) {
    console.error("❌ Error checking email:", error)
    return false
  }
}

// Update user password
export async function updateUserPassword(email: string, newPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { password: hashedPassword },
    })

    console.log("✅ Password updated for:", email)
    return true
  } catch (error) {
    console.error("❌ Error updating password:", error)
    return false
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role as "user" | "security" | "department_admin",
      department: user.department || undefined,
      createdAt: user.createdAt,
    }
  } catch (error) {
    console.error("❌ Error getting user by email:", error)
    return null
  }
}
