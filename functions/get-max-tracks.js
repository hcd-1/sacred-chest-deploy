const { createClient } = require('@supabase/supabase-js');

exports.handler = async function () {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { data, error } = await supabase
      .from('verses')
      .select('special')
      .not('day_month', 'is', null)
      .order('special', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0 || isNaN(parseInt(data[0].special))) {
      console.warn('No valid special values found; defaulting to 1');
      return {
        statusCode: 200,
        body: JSON.stringify({ maxTracks: 1 })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ maxTracks: parseInt(data[0].special) })
    };
  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};