import { supabase } from '../_supabase.js';

export default async function handler(req, res) {
  // 1. Switch to POST for simplified universal matching
  if (req.method !== 'POST' && req.method !== 'PATCH') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed. Use POST or PATCH.` });
  }

  // 2. Extract ID and status from the BODY (not the URL)
  const { id, status } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Error: Missing complaint ID (id) in request body.' });
  }

  if (!status) {
    return res.status(400).json({ message: 'Error: Status field is required in request body.' });
  }

  // 3. Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Authentication required. Missing token.' });
  const token = authHeader.replace('Bearer ', '');

  try {
    // 4. Validate Session
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    }

    // 5. Check Admin Role
    const { data: profile, error: profileErr } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileErr || profile?.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: Admin privileges required.' });
    }

    // 6. Execute the Update using the ID from the body
    const { data: updatedData, error: updateErr } = await supabase
      .from('complaints')
      .update({ status: status })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      return res.status(400).json({ message: `Database update failed: ${updateErr.message}` });
    }

    return res.status(200).json({ 
      message: 'Complaint status updated successfully!', 
      data: updatedData 
    });

  } catch (err) {
    console.error('Fatal API Error:', err);
    return res.status(500).json({ 
      message: 'Internal Application Error. Please try again.', 
      details: err.message 
    });
  }
}
