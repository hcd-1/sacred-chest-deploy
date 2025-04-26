const { createClient } = require('@supabase/supabase-js');

exports.handler = async function (event) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    const { data, error } = await supabase
      .from('verses')
      .select('day_month, special')
      .not('day_month', 'is', null)
      .in('day_month', Array.from({ length: 31 }, (_, i) => (i + 1).toString()));

    if (error || !data) {
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch verse counts' })
      };
    }

    const verseCounts = {};
    data.forEach(({ day_month, special }) => {
      if (!verseCounts[day_month]) {
        verseCounts[day_month] = new Set();
      }
      if (special && !isNaN(parseInt(special))) {
        verseCounts[day_month].add(special);
      }
    });
    Object.keys(verseCounts).forEach(day => {
      verseCounts[day] = verseCounts[day].size;
    });

    return {
      statusCode: 200,
      body: JSON.stringify(verseCounts)
    };
  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};