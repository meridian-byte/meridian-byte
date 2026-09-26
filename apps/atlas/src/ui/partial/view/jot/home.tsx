'use client';

import React from 'react';

export default function Home() {
  return (
    <div>
      <div>
        <p>cta's</p>
      </div>

      <hr />

      <div>
        <p>recent notes</p>
        {/* implement local storage tracking for this to track last opened notes in addition to updatedAt */}
      </div>

      <hr />

      <div>
        <p>notes interacted with (viewed/edited/updated incl.deleted)</p>

        <p>this week</p>
        <p>last week</p>
        <p>this month</p>
        <p>last month</p>
      </div>
    </div>
  );
}
