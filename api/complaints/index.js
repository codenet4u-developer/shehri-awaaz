import { supabase } from '../_supabase.js';

export default async function handler(req, res) {
  // Common authentication check (assuming frontend sends Bearer token in Authorization header)
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });
  const token = authHeader.replace('Bearer ', '');
  
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ message: 'Invalid token' });

  // Get user role
  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  const isAdmin = userData?.role === 'admin';

  if (req.method === 'GET') {
    try {
      let query = supabase.from('complaints').select(`
        *,
        users (name, email),
        attachments (file_url)
      `);

      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === 'POST') {
    const { title, description, category, location, file_url } = req.body;
    
    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: 'Title, description, category, and location are required' });
    }

    try {
      // Create complaint
      const { data: complaint, error: insertError } = await supabase
        .from('complaints')
        .insert([{ user_id: user.id, title, description, category, location, status: 'pending' }])
        .select()
        .single();
        
      if (insertError) throw insertError;

      // Add attachment entry if provided
      if (file_url) {
        await supabase
          .from('attachments')
          .insert([{ complaint_id: complaint.id, file_url }]);
      }

      // Fetch the full complaint with joins returning it to the client
      const { data: fullComplaint } = await supabase
        .from('complaints')
        .select('*, users(name, email), attachments(file_url)')
        .eq('id', complaint.id)
        .single();

      return res.status(201).json(fullComplaint);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === 'PATCH') {
    if (!isAdmin) {
      return res.status(403).json({ message: 'Access Denied: Admin privileges required.' });
    }

    const { status } = req.body;
    const { id } = req.query; // Assuming Vercel uses query params for dynamic routes

    if (!status || !["pending", "processing", "resolved"].includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
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

  return res.status(405).json({ message: 'Method Not Allowed' });
}
