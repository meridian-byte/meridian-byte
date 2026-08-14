'use client';

import React from 'react';
import ModalSearch from '../modal/search';
import ModalCrudCalendar from '../modal/crud/calendar';

export default function Modal({ children }: { children: React.ReactNode }) {
  return (
    <ModalSearch>
      <ModalCrudCalendar>
        <div>{children}</div>
      </ModalCrudCalendar>
    </ModalSearch>
  );
}
