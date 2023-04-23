import CustomerChangedEvent from "../customer/customer-changed.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import EnviaConsoleLogHandler from "../customer/handler/envia-console-log.handler";
import EnviaConsoleLog1Handler from "../customer/handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "../customer/handler/envia-console-log2.handler";
import SendEmailWhenProductIsCreatedHandle from "../product/handler/send-emal-when-product-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {

  // Product
  it("should register a product event handler", async () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandle();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister a product event handler", async () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandle();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all product event handlers", async () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandle();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
  });

  it("should notify all product event handlers", async () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandle();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0
    });

    // Should run SendEmailWhenProductIsCreatedHandle.handle() when notify method is executed
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify all customer event handlers", async () => {
    const eventDispatcher = new EventDispatcher();
    const enviaConsoleLog1EventHandler = new EnviaConsoleLog1Handler();
    const enviaConsoleLog2EventHandler = new EnviaConsoleLog2Handler();
    const spyEnviaConsoleLog1EventHandler = jest.spyOn(enviaConsoleLog1EventHandler, "handle");
    const spyEnviaConsoleLog2EventHandler = jest.spyOn(enviaConsoleLog2EventHandler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog1EventHandler);
    eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog2EventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(enviaConsoleLog1EventHandler);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(enviaConsoleLog2EventHandler);

    const customerCreatedEvent1 = new CustomerCreatedEvent({
      name: "Customer",
      lastname: "1",
    });

    eventDispatcher.notify(customerCreatedEvent1);

    expect(spyEnviaConsoleLog1EventHandler).toHaveBeenCalled();
    expect(spyEnviaConsoleLog2EventHandler).toHaveBeenCalled();
  });

  it("should notify when change customer address event handlers", async () => {
    const eventDispatcher = new EventDispatcher();
    const enviaConsoleLogEventHandler = new EnviaConsoleLogHandler();
    const spyEnviaConsoleLogEventHandler = jest.spyOn(enviaConsoleLogEventHandler, "handle");

    eventDispatcher.register("CustomerChangedEvent", enviaConsoleLogEventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerChangedEvent"][0]).toMatchObject(enviaConsoleLogEventHandler);

    const customerChangedEvent = new CustomerChangedEvent({
      id: "1",
      name: "Customer 1",
      address: {
        street: "Street",
        number: "1",
        zipcode: "Zipcode 1",
        city: "City 1"
      }
    });

    eventDispatcher.notify(customerChangedEvent);

    expect(spyEnviaConsoleLogEventHandler).toHaveBeenCalled();
  });
});
