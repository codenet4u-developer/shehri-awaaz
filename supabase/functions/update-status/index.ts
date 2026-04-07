import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: Request): Promise<Response> {
  // 1. Switch to POST for simplified universal matching
  if (req.method !== 'POST' && req.method !== 'PATCH') {
    return new Response(JSON.stringify({ message: `Method ${req.method} Not Allowed. Use POST or PATCH.` }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Extract ID and status from the BODY (not the URL)
  const { id, status } = await req.json();

  if (!id) {
    return new Response(JSON.stringify({ message: 'Error: Missing complaint ID (id) in request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!status) {
    return new Response(JSON.stringify({ message: 'Error: Status field is required in request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. Authorization
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return new Response(JSON.stringify({ message: 'Authentication required. Missing token.' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
  const token = authHeader.replace('Bearer ', '');

  try {
    // 4. Validate Session
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ message: 'Your session has expired. Please log in again.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 5. Check Admin Role
    const { data: profile, error: profileErr } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileErr || profile?.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Access Denied: Admin privileges required.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 6. Execute the Update using the ID from the body
    const { data: updatedData, error: updateErr } = await supabase
      .from('complaints')
      .update({ status: status })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      return new Response(JSON.stringify({ message: `Database update failed: ${updateErr.message}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      message: 'Complaint status updated successfully!',
      data: updatedData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Fatal API Error:', err);
    return new Response(JSON.stringify({
      message: 'Internal Application Error. Please try again.',
      details: err.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}