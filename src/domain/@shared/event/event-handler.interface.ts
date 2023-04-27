import EventInterface from "./event.interface";

export default interface EventHandleInterface<T extends EventInterface=EventInterface> {
  handle(event: T): void;
}
