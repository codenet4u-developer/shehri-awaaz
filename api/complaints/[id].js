import { supabase } from '../_supabase.js';

export default async function handler(req, res) {
  // 1. Defensive Check for HTTP Method
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: `Method ${req.method} Not Allowed. Use PATCH.` });
  }

  // 2. Extract Route Params (id) and Payload
  const { id } = req.query;
  const complaintId = Array.isArray(id) ? id[0] : id;
  const { status } = req.body;

  if (!complaintId) {
    return res.status(400).json({ message: 'Error: Missing complaint ID in the request URL.' });
  }

  if (!status) {
    return res.status(400).json({ message: 'Error: Status field is required in the request body.' });
  }

  // 3. Authorization Boilerplate
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Authentication required. Missing token.' });
  const token = authHeader.replace('Bearer ', '');

  try {
    // 4. Validate Session
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    }

    // 5. Explicitly Validate Role from Database
    const { data: profile, error: profileErr } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileErr) {
      return res.status(500).json({ message: `Database error checking role: ${profileErr.message}` });
    }

    if (profile?.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: Admin privileges required for this action.' });
    }

    // 6. Execute the Update
    const { data: updatedData, error: updateErr } = await supabase
      .from('complaints')
      .update({ status: status })
      .eq('id', complaintId)
      .select()
      .single();

    if (updateErr) {
      return res.status(400).json({ message: `Supabase Update Failed: ${updateErr.message}` });
    }

    // 7. Success Response
    return res.status(200).json({ 
      message: 'Complaint status updated successfully!', 
      data: updatedData 
    });

  } catch (err) {
    // 8. Catch-all for unexpected crashes
    console.error('Fatal API Error:', err);
    return res.status(500).json({ 
      message: 'Internal Application Error. Please try again later.', 
      details: err.message 
    });
  }
}
