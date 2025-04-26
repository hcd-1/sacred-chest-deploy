const { createClient } = require('@supabase/supabase-js');

exports.handler = async function (event) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { special, day_month } = event.queryStringParameters || {};

  try {
    let query = supabase.from('verses').select('*');

    if (special) {
      query = query.eq('special', special).single();
    } else if (day_month) {
      query = query.eq('day_month', day_month);
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing special or day_month parameter' })
      };
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch verse' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};