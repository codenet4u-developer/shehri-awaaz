import { supabase } from '../_supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;
  const { status } = req.body;

  if (!status || !["pending", "processing", "resolved"].includes(status.toLowerCase())) {
    return res.status(400).json({ message: "Invalid status" });
  }

  // Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = authHeader.replace('Bearer ', '');

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return res.status(401).json({ message: 'Invalid token' });

    // Check Admin Role
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (!profile || profile.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: Admin privileges required.' });
    }

    const { data: complaint, error } = await supabase
      .from('complaints')
      .update({ status: status.toLowerCase() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}