import { supabase } from '../_supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Fetch user details from public users table to get role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('name, role')
      .eq('id', authData.user.id)
      .single();

    if (userError) throw userError;

    // We return both tokens and full user shape (matching what Express did before vaguely)
    return res.status(200).json({
      message: 'Logged in successfully',
      token: authData.session.access_token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: userData.name,
        role: userData.role,
      },
      session: authData.session
    });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid credentials', error: error.message });
  }
}
