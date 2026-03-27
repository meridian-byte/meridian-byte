import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
  useMemo,
} from 'react';
import { TextInput } from '@mantine/core';
import { useField } from '@mantine/form';
import classes from './rename.module.scss';

type RenameProps<T extends { id: string; title: string }> = {
  item: T;
  renameProps: {
    editing: boolean;
    setEditing: (editing: boolean) => void;
    updateItem: (values: T) => void;
    placeholder?: string; // optional default fallback if no title
  };
};

function RenameInner<T extends { id: string; title: string }>(
  { item, renameProps }: RenameProps<T>,
  ref: React.Ref<HTMLInputElement>
) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Expose inner ref to parent
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const field = useField({
    initialValue: item.title,
    validate: (value) => (value.trim().length < 1 ? true : null),
  });

  const handleBlur = () => {
    const value = field.getValue().trim();

    if (value.length < 1) {
      // restore old value or placeholder
      field.setValue(item.title || renameProps.placeholder || '');
    } else if (value !== item.title) {
      renameProps.updateItem({ ...item, title: value });
    }

    renameProps.setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      field.reset();
      e.currentTarget.blur();
    }

    if (e.key === 'Enter') {
      e.currentTarget.blur(); // triggers blur logic
    }
  };

  useEffect(() => {
    if (field.getValue() !== item.title) {
      field.setValue((item.title || renameProps.placeholder) ?? 'Untitled');
    }
  }, [item.title]);

  const inputStyles = useMemo(
    () => ({ input: { cursor: renameProps.editing ? undefined : 'pointer' } }),
    [renameProps.editing]
  );

  return (
    <TextInput
      id={`${item.id}-rename`}
      ref={inputRef}
      {...field.getInputProps()}
      tabIndex={renameProps.editing ? 0 : -1}
      onMouseDown={(e) => !renameProps.editing && e.preventDefault()}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      classNames={classes}
      size="xs"
      styles={inputStyles}
    />
  );
}

const Rename = forwardRef(RenameInner) as <
  T extends { id: string; title: string },
>(
  props: RenameProps<T> & { ref?: React.Ref<HTMLInputElement> }
) => ReturnType<typeof RenameInner>;

(Rename as any).displayName = 'Rename';

export default Rename;
