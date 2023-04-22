import EventHandleInterface from "./event-handler.interface";
import EventInterface from "./event.interface";

export default interface EventDispacherInterface {
  notify(event: EventInterface): void;
  register(eventName: string, eventHandle: EventHandleInterface): void;
  unregister(eventName: string, eventHandle: EventHandleInterface): void;
  unregisterAll(): void;
}
