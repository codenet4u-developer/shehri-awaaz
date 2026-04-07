import { supabase } from '../_supabase.js';

export default async function handler(req, res) {
  console.log('PATCH /api/complaints/[id] called', { method: req.method, query: req.query });

  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;
  const { status } = req.body;

  console.log('Request data', { id, status });

  if (!status || !["pending", "processing", "resolved"].includes(status.toLowerCase())) {
    console.log('Invalid status', status);
    return res.status(400).json({ message: "Invalid status" });
  }

  // Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('Missing auth header');
    return res.status(401).json({ message: 'Missing Authorization header' });
  }
  const token = authHeader.replace('Bearer ', '');

  try {
    console.log('Validating token');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.log('Invalid token', authError);
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('Checking admin role for user', user.id);
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (!profile || profile.role !== 'admin') {
      console.log('Not admin', profile);
      return res.status(403).json({ message: 'Access Denied: Admin privileges required.' });
    }

    console.log('Updating complaint', id, 'to status', status);
    const { data: complaint, error } = await supabase
      .from('complaints')
      .update({ status: status.toLowerCase() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log('Update error', error);
      throw error;
    }

    if (!complaint) {
      console.log('Complaint not found');
      return res.status(404).json({ message: "Complaint not found" });
    }

    console.log('Update successful', complaint);
    res.json(complaint);
  } catch (error) {
    console.log('Caught error', error);
    res.status(500).json({ message: error.message });
  }
}