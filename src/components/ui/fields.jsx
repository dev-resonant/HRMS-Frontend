/**
 * Small in-house UI kit on top of MUI. Pages import form controls from here so
 * label/helper/error handling and the grid class names ("full") stay consistent.
 */
import { Children, useState } from "react";
import dayjs from "dayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import {
  Alert,
  AlertTitle,
  Box,
  Button as MuiButton,
  Checkbox as MuiCheckbox,
  Chip,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const SIZE = { sm: "small", md: "medium", lg: "large" };
const KIND = {
  primary: { variant: "contained", color: "primary" },
  secondary: { variant: "contained", color: "secondary" },
  tertiary: { variant: "outlined", color: "primary" },
  ghost: { variant: "text", color: "primary" },
  danger: { variant: "contained", color: "error" },
  "danger--ghost": { variant: "text", color: "error" },
};

/** kind: primary | secondary | tertiary | ghost | danger | danger--ghost */
export function Button({ kind = "primary", size = "md", renderIcon: Icon, children, ...rest }) {
  const { variant, color } = KIND[kind] ?? KIND.primary;
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={SIZE[size] ?? "medium"}
      startIcon={Icon ? <Icon fontSize="small" /> : undefined}
      {...rest}
    >
      {children}
    </MuiButton>
  );
}

const SHRINK_TYPES = ["date", "time", "datetime-local", "month", "week"];

function fieldProps({ id, labelText, label, hideLabel, helperText, invalid, invalidText, type, placeholder, min, max, step, inputProps }) {
  return {
    id,
    label: hideLabel ? undefined : (labelText ?? label),
    helperText: invalid ? invalidText : helperText,
    error: !!invalid,
    type,
    placeholder,
    slotProps: {
      inputLabel: { shrink: SHRINK_TYPES.includes(type) || !!placeholder ? true : undefined },
      htmlInput: { min, max, step, ...inputProps },
    },
  };
}

/**
 * MUI date/time picker with the same value contract as the old <input type="date|time">:
 * value is "YYYY-MM-DD" / "HH:mm" and onChange receives { target: { value } }.
 */
function PickerInput({ type, id, labelText, helperText, invalid, invalidText, value, onChange, min, max, disabled, required, className }) {
  const textField = {
    id,
    className,
    size: "small",
    fullWidth: true,
    required,
    error: !!invalid,
    helperText: invalid ? invalidText : helperText,
  };
  if (type === "time") {
    const parsed = value ? dayjs(`2000-01-01T${String(value).slice(0, 5)}`) : null;
    return (
      <TimePicker
        label={labelText}
        value={parsed?.isValid() ? parsed : null}
        ampm={false}
        format="HH:mm"
        disabled={disabled}
        onChange={(d) => {
          if (d === null) onChange?.({ target: { value: "" } });
          else if (d.isValid()) onChange?.({ target: { value: d.format("HH:mm") } });
        }}
        slotProps={{ textField, field: { clearable: true } }}
      />
    );
  }
  const parsed = value ? dayjs(String(value).slice(0, 10)) : null;
  return (
    <DatePicker
      label={labelText}
      value={parsed?.isValid() ? parsed : null}
      format="DD/MM/YYYY"
      disabled={disabled}
      minDate={min ? dayjs(min) : undefined}
      maxDate={max ? dayjs(max) : undefined}
      onChange={(d) => {
        if (d === null) onChange?.({ target: { value: "" } });
        else if (d.isValid()) onChange?.({ target: { value: d.format("YYYY-MM-DD") } });
      }}
      slotProps={{ textField, field: { clearable: true } }}
    />
  );
}

export function TextInput({ labelText, helperText, invalid, invalidText, hideLabel, min, max, step, ...rest }) {
  const { type, placeholder, id } = rest;
  if (type === "date" || type === "time") {
    return <PickerInput {...rest} labelText={labelText} helperText={helperText} invalid={invalid} invalidText={invalidText} min={min} max={max} />;
  }
  return (
    <TextField
      {...rest}
      {...fieldProps({ id, labelText, hideLabel, helperText, invalid, invalidText, type, placeholder, min, max, step })}
    />
  );
}

export function PasswordInput({ labelText, helperText, invalid, invalidText, ...rest }) {
  const [show, setShow] = useState(false);
  const { id, placeholder } = rest;
  const base = fieldProps({ id, labelText, helperText, invalid, invalidText, placeholder });
  return (
    <TextField
      {...rest}
      {...base}
      type={show ? "text" : "password"}
      slotProps={{
        ...base.slotProps,
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                size="small"
                edge="end"
                aria-label={show ? "Hide password" : "Show password"}
                onClick={() => setShow((s) => !s)}
              >
                {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export function TextArea({ labelText, helperText, invalid, invalidText, rows = 3, ...rest }) {
  const { id, placeholder } = rest;
  return (
    <TextField
      {...rest}
      {...fieldProps({ id, labelText, helperText, invalid, invalidText, placeholder })}
      multiline
      minRows={rows}
    />
  );
}

/** onChange receives (event, { value }) like the previous API. */
export function NumberInput({ label, helperText, min, max, step, onChange, ...rest }) {
  const { id } = rest;
  return (
    <TextField
      {...rest}
      {...fieldProps({ id, label, helperText, type: "number", min, max, step })}
      onChange={(e) => onChange?.(e, { value: e.target.value })}
    />
  );
}

/** MUI dropdown (not the browser's native <select>): children are <SelectItem/> markers. */
export function Select({ labelText, helperText, invalid, invalidText, children, ...rest }) {
  const { id } = rest;
  const base = fieldProps({ id, labelText, helperText, invalid, invalidText });
  const options = Children.toArray(children).filter((c) => c?.props && "value" in c.props);
  return (
    <TextField
      {...rest}
      {...base}
      select
      slotProps={{
        ...base.slotProps,
        inputLabel: { shrink: true },
        select: { displayEmpty: true, MenuProps: { slotProps: { paper: { sx: { maxHeight: 320 } } } } },
      }}
    >
      {options.map((c) => (
        <MenuItem key={String(c.props.value)} value={c.props.value} sx={{ minHeight: 36 }}>
          {c.props.text || " "}
        </MenuItem>
      ))}
    </TextField>
  );
}

/** Option marker read by <Select/>; renders nothing on its own. */
export function SelectItem() {
  return null;
}

/** onChange receives (event, { checked }) like the previous API. */
export function Checkbox({ id, labelText, checked, onChange, disabled, className }) {
  return (
    <FormControlLabel
      className={className}
      disabled={disabled}
      label={labelText}
      control={<MuiCheckbox id={id} size="small" checked={!!checked} onChange={(e) => onChange?.(e, { checked: e.target.checked })} />}
    />
  );
}

export function Search({ id, labelText, placeholder, value, onChange, onClear, size = "md" }) {
  return (
    <TextField
      id={id}
      size={size === "sm" ? "small" : "small"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      slotProps={{
        htmlInput: { "aria-label": labelText },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" edge="end" aria-label="Clear search" onClick={onClear}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}

/** kind: success | error | warning | info */
export function InlineNotification({ kind = "info", title, subtitle, children }) {
  return (
    <Alert severity={kind} variant="outlined" sx={{ alignItems: "center" }}>
      {title && <AlertTitle sx={{ mb: subtitle ? 0.25 : 0 }}>{title}</AlertTitle>}
      {subtitle}
      {children}
    </Alert>
  );
}

const TAG_COLOR = {
  purple: "secondary",
  blue: "primary",
  cyan: "info",
  green: "success",
  red: "error",
  magenta: "error",
  teal: "success",
};

/** Small coloured pill. type: purple | blue | cyan | green | red | gray | outline … */
export function Tag({ type = "gray", children, title }) {
  const color = TAG_COLOR[type];
  return (
    <Chip
      size="small"
      title={title}
      label={children}
      color={color ?? "default"}
      variant={color ? "filled" : "outlined"}
      sx={{ mr: 0.5, mb: 0.25 }}
    />
  );
}

/** tabs: [{ label, content }] — falsy entries are skipped. */
export function TabsView({ tabs }) {
  const visible = tabs.filter(Boolean);
  const [index, setIndex] = useState(0);
  const active = Math.min(index, visible.length - 1);
  return (
    <Box>
      <Tabs value={active} onChange={(_, v) => setIndex(v)} variant="scrollable" scrollButtons="auto" sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        {visible.map((t) => (
          <Tab key={t.label} label={t.label} />
        ))}
      </Tabs>
      {visible[active]?.content}
    </Box>
  );
}
