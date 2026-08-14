'use client';

import React from 'react';
import ModalSearch from '../modal/search';
import ModalCrudCalendar from '../modal/crud/calendar';
import ModalCrudNote from '../modal/crud/note';

export default function Modal({ children }: { children: React.ReactNode }) {
  return (
    <ModalSearch>
      <ModalCrudCalendar>
        <ModalCrudNote>
          <div>{children}</div>
        </ModalCrudNote>
      </ModalCrudCalendar>
    </ModalSearch>
  );
}
