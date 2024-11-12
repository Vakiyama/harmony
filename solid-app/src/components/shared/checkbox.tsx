import { Accessor, Setter } from "solid-js";
import {
  Checkbox as CheckboxWrapper,
  CheckboxControl,
  CheckboxLabel,
} from "~/components/ui/checkbox";

const Checkbox = (props: {
  label: string;
  checked: Accessor<boolean>;
  setChecked: Setter<boolean>;
}) => {
  return (
    <CheckboxWrapper
      class="flex items-center space-x-2"
      checked={props.checked()}
      onChange={props.setChecked}
    >
      <CheckboxControl />
      <CheckboxLabel class="text-[#1e1e1e] text-base font-normal font-sf-pro leading-tight">
        {props.label}
      </CheckboxLabel>
    </CheckboxWrapper>
  );
};

export default Checkbox;
