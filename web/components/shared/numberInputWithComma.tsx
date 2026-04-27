import type { ReactNode } from "react";
import { useState } from "react";

import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

type Props = {
  label?: string;
  unit?: string;
  value: number;
  onChange: (value: number) => void;
  tooltip?: ReactNode;
  request?: boolean;
  disabled?: boolean;
  error?: boolean;
};

export function NumberInputWithComma({
  label,
  unit,
  value,
  onChange,
  tooltip,
  request,
  disabled,
  error
}: Props) {
  const [display, setDisplay] = useState("");
  const displayValue = display || value.toLocaleString("th-TH", { minimumFractionDigits: 0 });

  return (
    <FormItem className="flex flex-col gap-2">
      {label ? (
        <FormLabel>
          {label} {request ? <span className="text-red-500">*</span> : null}
          {tooltip && tooltip}
        </FormLabel>
      ) : null}
      <FormControl>
        <InputGroup>
          <InputGroupInput
            type="text"
            value={displayValue}
            disabled={disabled}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, "");
              const num = Number(raw);
              if (!isNaN(num)) {
                onChange(num);
                setDisplay(num.toLocaleString("th-TH", { minimumFractionDigits: 0 }));
              } else {
                setDisplay(e.target.value);
              }
            }}
            onBlur={() => {
              setDisplay("");
            }}
          />
          {unit && <InputGroupAddon align="inline-end">{unit}</InputGroupAddon>}
        </InputGroup>
      </FormControl>
      {error && <FormMessage />}
    </FormItem>
  );
}
