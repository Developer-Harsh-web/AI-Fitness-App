import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { MOCK_USER } from '../../../../lib/hooks/UserContext';

/**
 * API endpoint to check if a user account exists before login
 * This is a mock implementation for demo purposes
 * In a real application, you would query your database
 */
export async function POST(req: NextRequest) {
  try {
    const { provider, email } = await req.json();
    
    // In a real app, you would check if the user exists in your database
    // For demo purposes, we're just simulating this check
    const mockRegisteredUsers = [
      { email: 'john@example.com', provider: 'credentials' },
      { email: 'user@example.com', provider: 'credentials' },
      { email: 'test@test.com', provider: 'credentials' },
      // Add more registered users for demo purposes
    ];

    // Check if this is a provider-based check or email-based check
    let userExists = false;
    
    if (provider && provider === 'google') {
      // For Google sign-in, simulate a 50% chance that the user exists
      // In a real app, you would check if a user with this Google account exists
      userExists = Math.random() > 0.5;
    } else if (email) {
      // For email login, check against our mock database
      userExists = mockRegisteredUsers.some(user => user.email === email);
    }

    // Return the result
    return NextResponse.json({ exists: userExists });
  } catch (error) {
    console.error('Error checking account:', error);
    return NextResponse.json(
      { error: 'Failed to check if account exists' },
      { status: 500 }
    );
  }
} 