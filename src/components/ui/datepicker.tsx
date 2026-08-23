import { Button } from '@/components/ui/button';
import { Calendar, type CalendarProps } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { addYears, format, subYears } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

interface Props {
    placeholder?: string;
    selected?: Date;
    isPending?: boolean;
}

export const DatePicker = React.forwardRef<
    HTMLButtonElement,
    CalendarProps & Props
>(({ placeholder = 'Pick a date', isPending = false, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger render={<Button
                variant="outline"
                data-empty={!props.selected}
                className="data-[empty=true]:text-muted-foreground hover:bg-background w-full justify-start text-left font-normal shadow-none"
            >
                <CalendarIcon className="h-4 w-4" />
                {props.selected ? (
                    format(props.selected, 'PPP')
                ) : (
                    <span>{placeholder}</span>
                )}
            </Button>} ref={ref} disabled={isPending}>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    onDayClick={() => setOpen(false)}
                    startMonth={subYears(new Date(), 5)}
                    endMonth={addYears(new Date(), 8)}
                    {...props}
                />
            </PopoverContent>
        </Popover>
    );
});

DatePicker.displayName = "DatePicker";
