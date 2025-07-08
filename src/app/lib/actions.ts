'use server';
import { signIn } from '../../../auth';
import { AuthError } from 'next-auth';
import { registerHelper } from './helpers'
import { redirect } from 'next/navigation';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function register(
  prevState: string | undefined,
  formData: FormData,
) {
  const result = await registerHelper(formData);
  if (!result?.success) {
    return result?.message
  }

  return '/login'

  //redirect('/login')
}

export async function submitNewVendor(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const response = await fetch(`https://localhost:5000/api/users`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const res = await response.json()

    if (!response.ok)
      return res["message"]
  } catch (error) {
    throw error;
  }
}