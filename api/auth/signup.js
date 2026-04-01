import { supabase } from '../_supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, password, role } = req.body;
  const userRole = (role === 'admin') ? 'admin' : 'citizen';

  try {
    // 1. Register with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // 2. Insert into the public users table 
    const userId = authData.user?.id;
    if (userId) {
      const { error: dbError } = await supabase
        .from('users')
        .insert([{ id: userId, name: name, email: email, role: userRole }]);
      
      if (dbError) throw dbError;
    }

    return res.status(201).json({ message: 'User registered successfully', user: authData.user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
