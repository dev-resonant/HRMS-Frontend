import { useState } from "react";

/**
 * Tiny controlled-form helper.
 *   const [form, set, setForm] = useFormState({ name: "" });
 *   <TextInput value={form.name} onChange={set("name")} />
 * `set(key)` accepts a DOM event or a raw value.
 */
export function useFormState(initial) {
  const [form, setForm] = useState(initial);
  const set = (key) => (eventOrValue) =>
    setForm((prev) => ({
      ...prev,
      [key]: eventOrValue?.target ? eventOrValue.target.value : eventOrValue,
    }));
  return [form, set, setForm];
}
