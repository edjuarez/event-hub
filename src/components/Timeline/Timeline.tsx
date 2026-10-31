import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { KeyboardEvent } from "react";

import type { CalendarEvent } from "../../types/event";
import { groupEventsByDay } from "../../utils/groupEventsByDay";
import { TimelineGroup } from "./TimelineGroup";
import { TimelineItem } from "./TimelineItem";
import { TimelineToolbar } from "./TimelineToolbar";

interface TimelineProps {
  events: CalendarEvent[];
  totalCount: number;
}

type TimelineRow =
  | {
      type: "group";
      key: string;
      groupIndex: number;
      date: Date;
      eventCount: number;
    }
  | {
      type: "event";
      key: string;
      groupIndex: number;
      eventIndex: number;
      eventNumber: number;
      date: Date;
      event: CalendarEvent;
      headingId: string;
    };

export function Timeline({ events, totalCount }: TimelineProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLElement>());

  const [announcement, setAnnouncement] = useState("");
  const [activeEventKey, setActiveEventKey] = useState<string | null>(null);
  const [pendingFocusIndex, setPendingFocusIndex] = useState<number | null>(
    null,
  );

  const groups = useMemo(() => groupEventsByDay(events), [events]);

  const rows = useMemo<TimelineRow[]>(() => {
    const result: TimelineRow[] = [];
    let eventNumber = 0;

    groups.forEach((group, groupIndex) => {
      result.push({
        type: "group",
        key: `group-${group.dateKey}`,
        groupIndex,
        date: group.date,
        eventCount: group.events.length,
      });

      group.events.forEach((event, eventIndex) => {
        eventNumber += 1;

        result.push({
          type: "event",
          key: `event-${event.id}`,
          groupIndex,
          eventIndex,
          eventNumber,
          date: group.date,
          event,
          headingId: `timeline-heading-${group.dateKey}`,
        });
      });
    });

    return result;
  }, [groups]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => (rows[index].type === "group" ? 52 : 110),
    overscan: 8,
    getItemKey: (index) => rows[index].key,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const eventRowIndexes = useMemo(
    () =>
      rows.reduce<number[]>((indexes, row, index) => {
        if (row.type === "event") {
          indexes.push(index);
        }

        return indexes;
      }, []),
    [rows],
  );

  const firstEventKey = eventRowIndexes.length
    ? rows[eventRowIndexes[0]].key
    : null;

  const hasActiveEvent = rows.some(
    (row) => row.type === "event" && row.key === activeEventKey,
  );

  const focusEvent = (rowIndex: number) => {
    const row = rows[rowIndex];

    if (!row || row.type !== "event") {
      return;
    }

    setPendingFocusIndex(rowIndex);
    virtualizer.scrollToIndex(rowIndex, { align: "auto" });
  };

  const goToStart = () => {
    if (eventRowIndexes.length > 0) {
      focusEvent(eventRowIndexes[0]);
    }
  };

  const goToEnd = () => {
    if (eventRowIndexes.length > 0) {
      focusEvent(eventRowIndexes[eventRowIndexes.length - 1]);
    }
  };

  useEffect(() => {
    if (pendingFocusIndex === null) {
      return;
    }

    const row = rows[pendingFocusIndex];

    if (!row || row.type !== "event") {
      setPendingFocusIndex(null);
      return;
    }

    const element = itemRefs.current.get(row.key);

    if (element) {
      element.focus();
      setPendingFocusIndex(null);
    }
  }, [pendingFocusIndex, virtualItems, rows]);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLElement>,
    currentRowIndex: number,
  ) => {
    const currentRow = rows[currentRowIndex];

    if (!currentRow || currentRow.type !== "event") {
      return;
    }

    let targetRowIndex: number | undefined;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp": {
        event.preventDefault();

        const currentPosition = eventRowIndexes.indexOf(currentRowIndex);
        targetRowIndex = eventRowIndexes[currentPosition - 1];
        break;
      }

      case "ArrowRight":
      case "ArrowDown": {
        event.preventDefault();

        const currentPosition = eventRowIndexes.indexOf(currentRowIndex);
        targetRowIndex = eventRowIndexes[currentPosition + 1];
        break;
      }

      case "Home": {
        event.preventDefault();
        targetRowIndex = eventRowIndexes[0];
        break;
      }

      case "End": {
        event.preventDefault();
        targetRowIndex = eventRowIndexes[eventRowIndexes.length - 1];
        break;
      }

      default:
        return;
    }

    if (targetRowIndex !== undefined) {
      focusEvent(targetRowIndex);
    }
  };

  const handleItemFocus = (row: Extract<TimelineRow, { type: "event" }>) => {
    const formattedDate = row.date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    setActiveEventKey(row.key);

    setAnnouncement(
      `${row.event.title}. ${formattedDate}. Event ${row.eventNumber} of ${events.length}.`,
    );
  };

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-10 text-center">
        <p className="font-medium text-text-primary">No events yet</p>
        <p className="mt-1 text-sm text-text-muted">
          Events will appear here when they are created.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <TimelineToolbar
        displayedCount={events.length}
        totalCount={totalCount}
        onGoToStart={goToStart}
        onGoToEnd={goToEnd}
      />

      <div
        ref={parentRef}
        role="region"
        aria-label="Events timeline"
        tabIndex={-1}
        className="h-[680px] overflow-y-auto rounded-xl border border-border bg-background px-4"
      >
        <div
          className="relative w-full"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualItems.map((virtualRow) => {
            const row = rows[virtualRow.index];

            return (
              <div
                key={row.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="absolute left-0 top-0 w-full pb-3"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.type === "group" ? (
                  <TimelineGroup
                    date={row.date}
                    eventCount={row.eventCount}
                    headingId={`timeline-heading-${groups[row.groupIndex].dateKey}`}
                  />
                ) : (
                  <div className="w-full min-w-0 pl-4">
                    <TimelineItem
                      event={row.event}
                      eventNumber={row.eventNumber}
                      headingId={row.headingId}
                      tabIndex={
                        (hasActiveEvent && activeEventKey === row.key) ||
                        (!hasActiveEvent && row.key === firstEventKey)
                          ? 0
                          : -1
                      }
                      itemRef={(element) => {
                        if (element) {
                          itemRefs.current.set(row.key, element);
                        } else {
                          itemRefs.current.delete(row.key);
                        }
                      }}
                      onFocus={() => handleItemFocus(row)}
                      onKeyDown={(event) =>
                        handleKeyDown(event, virtualRow.index)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </div>
  );
}
