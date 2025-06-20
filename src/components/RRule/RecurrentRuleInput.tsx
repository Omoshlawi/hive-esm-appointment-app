import {
  Box,
  Button,
  Collapse,
  Divider,
  Group,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  useComputedColorScheme,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconCalendar,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { Frequency, RRule, Weekday } from "rrule";
import { INPUT_ORDER } from "../../utils/constants";

export interface RecurrentRuleInputProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  withAsterisk?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  startDate?: Date | Dayjs;
  maxCount?: number;
  maxUntil?: Date | Dayjs;
  hideAdvanced?: boolean;
  compact?: boolean;
}

const FREQUENCY_OPTIONS = [
  { value: String(Frequency.DAILY), label: "Daily" },
  { value: String(Frequency.WEEKLY), label: "Weekly" },
  { value: String(Frequency.MONTHLY), label: "Monthly" },
  { value: String(Frequency.YEARLY), label: "Yearly" },
];

const WEEKDAY_OPTIONS = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

const WEEKDAY_SHORT = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: dayjs().month(i).format("MMMM"),
}));

const MONTHDAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

interface ParsedRule {
  freq: number;
  interval: number;
  byweekday: number[];
  bymonthday: number[];
  bymonth: number[];
  count?: number;
  until?: Date | Dayjs;
  wkst: number;
}

export const RecurrentRuleInput: React.FC<RecurrentRuleInputProps> = ({
  value = "",
  onChange,
  label = "Recurrence Rule",
  description,
  placeholder = "Select recurrence pattern...",
  error,
  disabled = false,
  required = false,
  withAsterisk,
  size = "sm",
  startDate = dayjs(),
  maxCount = 999,
  maxUntil,
  hideAdvanced = false,
  compact = false,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [endType, setEndType] = useState<"never" | "count" | "until">("never");
  const colorScheme = useComputedColorScheme();
  // Parse RRULE string into structured data
  const parsedRule = useMemo((): ParsedRule => {
    if (!value) {
      return {
        freq: Frequency.WEEKLY,
        interval: 1,
        byweekday: [],
        bymonthday: [],
        bymonth: [],
        wkst: RRule.MO.weekday,
      };
    }

    try {
      const rule = RRule.fromString(value);
      const options = rule.options;

      return {
        freq: options.freq || Frequency.WEEKLY,
        interval: options.interval || 1,
        byweekday:
          options.byweekday?.map((wd: number | Weekday) =>
            typeof wd === "number" ? wd : wd.weekday
          ) || [],
        bymonthday: options.bymonthday || [],
        bymonth: options.bymonth || [],
        count: options.count,
        until: options.until,
        wkst: (options.wkst as any)?.weekday || RRule.MO.weekday,
      };
    } catch (err) {
      console.warn("Invalid RRULE string:", value);
      return {
        freq: Frequency.WEEKLY,
        interval: 1,
        byweekday: [],
        bymonthday: [],
        bymonth: [],
        wkst: RRule.MO.weekday,
      };
    }
  }, [value]);

  // Update end type based on parsed rule
  useEffect(() => {
    if (parsedRule.count) {
      setEndType("count");
    } else if (parsedRule.until) {
      setEndType("until");
    } else {
      setEndType("never");
    }
  }, [parsedRule.count, parsedRule.until]);

  // Generate RRULE string from current state
  const generateRRule = (updates: Partial<ParsedRule> = {}) => {
    const merged = { ...parsedRule, ...updates };

    const options: any = {
      freq: merged.freq,
      interval: merged.interval,
      dtstart: dayjs(startDate).toDate(),
    };

    if (merged.byweekday.length > 0) {
      options.byweekday = merged.byweekday;
    }

    if (merged.bymonthday.length > 0) {
      options.bymonthday = merged.bymonthday;
    }

    if (merged.bymonth.length > 0) {
      options.bymonth = merged.bymonth;
    }

    if (endType === "count" && merged.count) {
      options.count = merged.count;
    } else if (endType === "until" && merged.until) {
      options.until = dayjs(merged.until).toDate();
    }

    options.wkst = merged.wkst;

    try {
      const rule = new RRule(options);
      return rule.toString();
    } catch (err) {
      console.warn("Error generating RRULE:", err);
      return "";
    }
  };

  const handleUpdate = (updates: Partial<ParsedRule>) => {
    const newRRule = generateRRule(updates);
    onChange?.(newRRule);
  };

  // Generate human-readable description
  const humanDescription = useMemo(() => {
    if (!value) return placeholder;

    try {
      const rule = RRule.fromString(value);
      return rule.toText();
    } catch {
      return "Invalid rule";
    }
  }, [value, placeholder]);

  const isWeekly = parsedRule.freq === Frequency.WEEKLY;
  const isMonthly = parsedRule.freq === Frequency.MONTHLY;
  const isYearly = parsedRule.freq === Frequency.YEARLY;

  return (
    <Box>
      {label && (
        <Text size={size} fw={500} mb="xs">
          {label}
          {(required || withAsterisk) && (
            <Text component="span" c="red">
              {" "}
              *
            </Text>
          )}
        </Text>
      )}

      {description && (
        <Text size="xs" c="dimmed" mb="sm">
          {description}
        </Text>
      )}

      <Paper p={compact ? "sm" : "md"} withBorder>
        <Stack gap={compact ? "xs" : "sm"}>
          {/* Basic Settings */}
          <Group grow>
            <Select
              label="Frequency"
              data={FREQUENCY_OPTIONS}
              value={String(parsedRule.freq)}
              onChange={(val) => val && handleUpdate({ freq: Number(val) })}
              size={size}
              disabled={disabled}
              inputWrapperOrder={INPUT_ORDER}
              description="How often the event recurs"
            />

            <NumberInput
              label="Every"
              min={1}
              max={999}
              value={parsedRule.interval}
              onChange={(val) => handleUpdate({ interval: Number(val) || 1 })}
              size={size}
              disabled={disabled}
              inputWrapperOrder={INPUT_ORDER}
              description={
                parsedRule.freq === Frequency.DAILY
                  ? " day(s)"
                  : parsedRule.freq === Frequency.WEEKLY
                  ? " week(s)"
                  : parsedRule.freq === Frequency.MONTHLY
                  ? " month(s)"
                  : " year(s)"
              }
            />
          </Group>

          {/* Weekly Options */}
          {isWeekly && (
            <MultiSelect
              label="On days"
              data={WEEKDAY_OPTIONS}
              value={parsedRule.byweekday.map(String)}
              onChange={(vals) => handleUpdate({ byweekday: vals.map(Number) })}
              placeholder="Select days of the week"
              size={size}
              disabled={disabled}
              clearable
            />
          )}

          {/* Monthly Options */}
          {isMonthly && (
            <MultiSelect
              label="On days of month"
              data={MONTHDAY_OPTIONS}
              value={parsedRule.bymonthday.map(String)}
              onChange={(vals) =>
                handleUpdate({ bymonthday: vals.map(Number) })
              }
              placeholder="Select days (1-31)"
              size={size}
              disabled={disabled}
              clearable
              searchable
            />
          )}

          {/* Yearly Options */}
          {isYearly && (
            <Group grow>
              <MultiSelect
                label="In months"
                data={MONTH_OPTIONS}
                value={parsedRule.bymonth.map(String)}
                onChange={(vals) => handleUpdate({ bymonth: vals.map(Number) })}
                placeholder="Select months"
                size={size}
                disabled={disabled}
                clearable
              />

              {parsedRule.bymonth.length > 0 && (
                <MultiSelect
                  label="On days"
                  data={MONTHDAY_OPTIONS}
                  value={parsedRule.bymonthday.map(String)}
                  onChange={(vals) =>
                    handleUpdate({ bymonthday: vals.map(Number) })
                  }
                  placeholder="Select days"
                  size={size}
                  disabled={disabled}
                  clearable
                />
              )}
            </Group>
          )}

          {/* End Conditions */}
          <Box>
            <Text size="sm" fw={500} mb="xs">
              Ends
            </Text>
            <Group>
              <Button
                variant={endType === "never" ? "filled" : "light"}
                size="xs"
                onClick={() => {
                  setEndType("never");
                  handleUpdate({ count: undefined, until: undefined });
                }}
                disabled={disabled}
              >
                Never
              </Button>

              <Button
                variant={endType === "count" ? "filled" : "light"}
                size="xs"
                onClick={() => setEndType("count")}
                disabled={disabled}
              >
                After
              </Button>

              <Button
                variant={endType === "until" ? "filled" : "light"}
                size="xs"
                onClick={() => setEndType("until")}
                disabled={disabled}
              >
                On date
              </Button>
            </Group>

            {endType === "count" && (
              <NumberInput
                label="Number of occurrences"
                min={1}
                max={maxCount}
                value={parsedRule.count || 1}
                onChange={(val) => handleUpdate({ count: Number(val) || 1 })}
                size={size}
                disabled={disabled}
                mt="xs"
              />
            )}

            {endType === "until" && (
              <DatePickerInput
                label="End date"
                value={
                  parsedRule.until ? dayjs(parsedRule.until).toDate() : null
                }
                onChange={(date) =>
                  handleUpdate({ until: date ? dayjs(date) : undefined })
                }
                size={size}
                disabled={disabled}
                minDate={dayjs(startDate).toDate()}
                maxDate={maxUntil ? dayjs(maxUntil).toDate() : undefined}
                leftSection={<IconCalendar size={16} />}
                mt="xs"
              />
            )}
          </Box>

          {/* Advanced Options */}
          {!hideAdvanced && (
            <>
              <Divider />
              <Group justify="space-between">
                <Button
                  variant="subtle"
                  size="xs"
                  leftSection={
                    showAdvanced ? (
                      <IconChevronUp size={14} />
                    ) : (
                      <IconChevronDown size={14} />
                    )
                  }
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  disabled={disabled}
                >
                  Advanced Options
                </Button>
              </Group>

              <Collapse in={showAdvanced}>
                <Stack gap="xs">
                  <Select
                    label="Week starts on"
                    data={WEEKDAY_OPTIONS}
                    value={String(parsedRule.wkst)}
                    onChange={(val) =>
                      val && handleUpdate({ wkst: Number(val) })
                    }
                    size={size}
                    disabled={disabled}
                  />
                </Stack>
              </Collapse>
            </>
          )}
          {/* Human readable description */}
          <Box
            bg={colorScheme === "dark" ? "dark.5" : "gray.0"}
            p="xs"
            style={{ borderRadius: 4 }}
          >
            <Text size="xs" c="dimmed">
              {humanDescription}
            </Text>
          </Box>

          <Box
            bg={colorScheme === "dark" ? "dark.5" : "gray.0"}
            p="xs"
            style={{ borderRadius: 4 }}
          >
            <Text size="xs" ff="monospace" c="dimmed">
              {value || "No rule defined"}
            </Text>
          </Box>
        </Stack>
      </Paper>

      {error && (
        <Text size="xs" c="red" mt="xs">
          {error}
        </Text>
      )}
    </Box>
  );
};
