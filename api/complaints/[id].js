import { supabase } from '../_supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Ensure id is a string (Vercel query params can be arrays)
  const complaintId = Array.isArray(id) ? id[0] : id;

  if (!complaintId) {
    return res.status(400).json({ message: 'Complaint ID is required' });
  }

  const { status } = req.body;

  // Validate status
  const validStatuses = ['pending', 'in-progress', 'resolved', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}` });
  }

  // Common authentication check
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = authHeader.replace('Bearer ', '');
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error(`Auth Error: ${authError?.message || 'User not found'}`);

    // Admin check
    const { data: userData, error: roleError } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (roleError) throw new Error(`Role Error: ${roleError.message}`);
    if (userData?.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized. Admin access required.' });
    }

    // Update complaint
    const { data, error: updateError } = await supabase
      .from('complaints')
      .update({ status })
      .eq('id', complaintId)
      .select()
      .single();

    if (updateError) throw new Error(`Update Error: ${updateError.message}`);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ 
      message: error.message,
      error: error
    });
  }
}
