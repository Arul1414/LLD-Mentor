import { Problem, RelationshipType } from '../types/index.js';

export interface ClassExampleDef {
  name: string;
  type?: 'Class' | 'Interface' | 'Abstract Class';
  responsibility: string;
  attributes: string[];
  methods: string[];
}

export interface RelationshipExampleDef {
  sourceClass: string;
  targetClass: string;
  relationship: RelationshipType;
  relationshipLabel: string;
  reason: string;
}

export interface ExplanationPrompts {
  reasoning: {
    question: string;
    placeholder: string;
    guidance: string;
  };
  assumptions: {
    question: string;
    placeholder: string;
    guidance: string;
  };
  tradeOffs: {
    question: string;
    placeholder: string;
    guidance: string;
  };
  extensibility: {
    question: string;
    placeholder: string;
    guidance: string;
  };
  patternsUsed: {
    question: string;
    placeholder: string;
    guidance: string;
  };
}

export interface ProblemConfig {
  key: string;
  title: string;
  classExamples: ClassExampleDef[];
  relationshipExamples: RelationshipExampleDef[];
  explanationPrompts: ExplanationPrompts;
  codeStarter: string;
  domainValidationRules: {
    keywords: string[];
    suggestedConceptsMessage: string;
    behaviors: {
      name: string;
      check: (classes: Array<{ name: string; methods: string[]; attributes: string[] }>) => boolean;
      hint: string;
    }[];
  };
}

export const PROBLEM_CONFIGS: Record<string, ProblemConfig> = {
  'parking-lot': {
    key: 'parking-lot',
    title: 'Parking Lot',
    classExamples: [
      {
        name: 'ParkingLot',
        type: 'Class',
        responsibility: 'Manage the overall parking lot and coordinate floors, parking, and ticket operations.',
        attributes: [
          'floors : List<ParkingFloor>',
          'pricingStrategy : PricingStrategy',
        ],
        methods: [
          'parkVehicle(vehicle : Vehicle) : ParkingTicket',
          'removeVehicle(ticket : ParkingTicket) : void',
          'calculateFee(ticket : ParkingTicket) : double',
        ],
      },
      {
        name: 'ParkingFloor',
        type: 'Class',
        responsibility: 'Manage parking spots available on a particular floor.',
        attributes: [
          'floorNumber : int',
          'parkingSpots : List<ParkingSpot>',
        ],
        methods: [
          'findAvailableSpot(vehicle : Vehicle) : ParkingSpot',
          'addParkingSpot(spot : ParkingSpot) : void',
        ],
      },
      {
        name: 'ParkingSpot',
        type: 'Class',
        responsibility: 'Represent a parking space and track its occupancy.',
        attributes: [
          'spotId : String',
          'spotType : SpotType',
          'occupied : boolean',
        ],
        methods: [
          'assignVehicle(vehicle : Vehicle) : void',
          'removeVehicle() : void',
          'isAvailable() : boolean',
        ],
      },
      {
        name: 'Vehicle',
        type: 'Abstract Class',
        responsibility: 'Represent a vehicle entering the parking lot.',
        attributes: [
          'vehicleNumber : String',
          'vehicleType : VehicleType',
        ],
        methods: [],
      },
      {
        name: 'ParkingTicket',
        type: 'Class',
        responsibility: "Track a vehicle's parking session and entry information.",
        attributes: [
          'ticketId : String',
          'entryTime : DateTime',
        ],
        methods: [],
      },
      {
        name: 'PricingStrategy',
        type: 'Interface',
        responsibility: 'Define how parking fees are calculated.',
        attributes: [],
        methods: [
          'calculateFee(ticket : ParkingTicket) : double',
        ],
      },
    ],
    relationshipExamples: [
      {
        sourceClass: 'ParkingLot',
        targetClass: 'ParkingFloor',
        relationship: 'COMPOSITION',
        relationshipLabel: 'Composition',
        reason: 'ParkingLot owns the lifecycle of its parking floors.',
      },
      {
        sourceClass: 'ParkingFloor',
        targetClass: 'ParkingSpot',
        relationship: 'COMPOSITION',
        relationshipLabel: 'Composition',
        reason: 'ParkingFloor manages and encapsulates individual parking spots.',
      },
      {
        sourceClass: 'ParkingSpot',
        targetClass: 'Vehicle',
        relationship: 'ASSOCIATION',
        relationshipLabel: 'Association',
        reason: 'ParkingSpot associates with an assigned vehicle when occupied.',
      },
      {
        sourceClass: 'ParkingLot',
        targetClass: 'ParkingTicket',
        relationship: 'ASSOCIATION',
        relationshipLabel: 'Association',
        reason: 'ParkingLot issues and validates parking session tickets.',
      },
      {
        sourceClass: 'ParkingLot',
        targetClass: 'PricingStrategy',
        relationship: 'DEPENDENCY',
        relationshipLabel: 'Dependency',
        reason: 'ParkingLot delegates fee computation to a PricingStrategy implementation.',
      },
    ],
    explanationPrompts: {
      reasoning: {
        question: 'Why did you choose these classes?',
        guidance: 'Explain how your classes divide parking, floor, spot, vehicle, ticket, and pricing responsibilities.',
        placeholder: 'Explain how your classes divide parking, floor, spot, vehicle, ticket, and pricing responsibilities.',
      },
      assumptions: {
        question: 'What assumptions did you make?',
        guidance: 'Explain assumptions about floors, parking spots, vehicle types, capacity, and ticket generation.',
        placeholder: 'Explain assumptions about floors, parking spots, vehicle types, capacity, and ticket generation.',
      },
      tradeOffs: {
        question: 'What alternatives did you consider?',
        guidance: 'Explain alternatives you considered for parking allocation and fee calculation.',
        placeholder: 'Explain alternatives you considered for parking allocation and fee calculation.',
      },
      extensibility: {
        question: 'How can your design handle future changes?',
        guidance: 'Explain how the design can support new vehicle types, parking spot types, and pricing strategies.',
        placeholder: 'Explain how the design can support new vehicle types, parking spot types, and pricing strategies.',
      },
      patternsUsed: {
        question: 'Which design patterns did you use and why?',
        guidance: 'Explain any patterns used for pricing, allocation, or other variable behavior.',
        placeholder: 'Explain any patterns used for pricing, allocation, or other variable behavior.',
      },
    },
    codeStarter: `class ParkingLot {
    private List<ParkingFloor> floors;

    public ParkingLot(List<ParkingFloor> floors) {
        this.floors = floors;
    }

    public ParkingTicket parkVehicle(Vehicle vehicle) {
        // TODO: implement parking logic
        return null;
    }

    public void removeVehicle(ParkingTicket ticket) {
        // TODO: implement removal logic
    }
}`,
    domainValidationRules: {
      keywords: ['parking', 'floor', 'spot', 'vehicle', 'ticket', 'fee', 'rate', 'price'],
      suggestedConceptsMessage:
        'Consider whether parking facility coordination, spot allocation, and ticketing/pricing concepts are represented in your design.',
      behaviors: [
        {
          name: 'Spot Allocation / Vehicle Placement',
          check: classes => {
            const names = classes.map(c => c.name.toLowerCase());
            const allMethods = classes.flatMap(c => c.methods).map(m => m.toLowerCase());
            return (
              names.some(n => n.includes('spot') || n.includes('space') || n.includes('floor')) ||
              allMethods.some(m => m.includes('park') || m.includes('spot') || m.includes('assign') || m.includes('find'))
            );
          },
          hint: 'Modeling parking spots or spot assignment methods helps demonstrate space management.',
        },
        {
          name: 'Ticketing / Fee Calculation',
          check: classes => {
            const names = classes.map(c => c.name.toLowerCase());
            const allMethods = classes.flatMap(c => c.methods).map(m => m.toLowerCase());
            return (
              names.some(n => n.includes('ticket') || n.includes('fee') || n.includes('price') || n.includes('rate') || n.includes('payment')) ||
              allMethods.some(m => m.includes('ticket') || m.includes('fee') || m.includes('pay') || m.includes('calc'))
            );
          },
          hint: 'Modeling tickets or pricing logic ensures entry/exit billing behavior is accounted for.',
        },
      ],
    },
  },

  'vending-machine': {
    key: 'vending-machine',
    title: 'Vending Machine',
    classExamples: [
      {
        name: 'VendingMachine',
        type: 'Class',
        responsibility: 'Manage product selection, payment, dispensing, and machine state.',
        attributes: [
          'slots : List<ProductSlot>',
          'currentState : VendingState',
          'balance : double',
        ],
        methods: [
          'selectProduct(productId : String) : void',
          'insertMoney(amount : double) : void',
          'dispenseProduct() : Product',
          'cancelTransaction() : void',
        ],
      },
      {
        name: 'Product',
        type: 'Class',
        responsibility: 'Represent a product available for purchase.',
        attributes: [
          'productId : String',
          'name : String',
          'price : double',
        ],
        methods: [
          'getPrice() : double',
          'getName() : String',
        ],
      },
      {
        name: 'ProductSlot',
        type: 'Class',
        responsibility: 'Store a product and track its available quantity.',
        attributes: [
          'slotId : String',
          'product : Product',
          'quantity : int',
        ],
        methods: [
          'isAvailable() : boolean',
          'removeProduct() : Product',
          'addProduct(product : Product) : void',
        ],
      },
      {
        name: 'Payment',
        type: 'Class',
        responsibility: 'Handle payment processing, validation, and refunds.',
        attributes: [
          'amount : double',
          'paymentMethod : PaymentMethod',
        ],
        methods: [
          'processPayment(amount : double) : boolean',
          'refund() : double',
        ],
      },
      {
        name: 'VendingState',
        type: 'Interface',
        responsibility: 'Define the behavior of the vending machine for different states.',
        attributes: [],
        methods: [
          'selectProduct(productId : String) : void',
          'insertMoney(amount : double) : void',
          'dispense() : void',
          'cancel() : void',
        ],
      },
    ],
    relationshipExamples: [
      {
        sourceClass: 'VendingMachine',
        targetClass: 'ProductSlot',
        relationship: 'COMPOSITION',
        relationshipLabel: 'Composition',
        reason: 'VendingMachine encapsulates and contains its physical product inventory slots.',
      },
      {
        sourceClass: 'ProductSlot',
        targetClass: 'Product',
        relationship: 'ASSOCIATION',
        relationshipLabel: 'Association',
        reason: 'ProductSlot holds and references the product currently stocked in that slot.',
      },
      {
        sourceClass: 'VendingMachine',
        targetClass: 'Payment',
        relationship: 'ASSOCIATION',
        relationshipLabel: 'Association',
        reason: 'VendingMachine delegates monetary validation and change calculation to Payment.',
      },
      {
        sourceClass: 'VendingMachine',
        targetClass: 'VendingState',
        relationship: 'COMPOSITION',
        relationshipLabel: 'Composition',
        reason: 'VendingMachine maintains reference to its active operational state.',
      },
      {
        sourceClass: 'VendingState',
        targetClass: 'VendingMachine',
        relationship: 'ASSOCIATION',
        relationshipLabel: 'Association',
        reason: 'State implementations trigger state transitions and dispensing on the machine context.',
      },
    ],
    explanationPrompts: {
      reasoning: {
        question: 'Why did you choose these classes?',
        guidance: 'Explain how your classes divide product, slot, payment, transaction, and machine-state responsibilities.',
        placeholder: 'Explain how your classes divide product, slot, payment, transaction, and machine-state responsibilities.',
      },
      assumptions: {
        question: 'What assumptions did you make?',
        guidance: 'Explain assumptions about inventory, payment, product availability, refunds, and machine states.',
        placeholder: 'Explain assumptions about inventory, payment, product availability, refunds, and machine states.',
      },
      tradeOffs: {
        question: 'What alternatives did you consider?',
        guidance: 'Explain alternatives considered for payment handling, inventory management, and state transitions.',
        placeholder: 'Explain alternatives considered for payment handling, inventory management, and state transitions.',
      },
      extensibility: {
        question: 'How can your design handle future changes?',
        guidance: 'Explain how the design can support new payment methods, products, pricing rules, and machine states.',
        placeholder: 'Explain how the design can support new payment methods, products, pricing rules, and machine states.',
      },
      patternsUsed: {
        question: 'Which design patterns did you use and why?',
        guidance: 'Explain whether the State Pattern or another pattern is useful and why.',
        placeholder: 'Explain whether the State Pattern or another pattern is useful and why.',
      },
    },
    codeStarter: `interface VendingState {
    void selectProduct(String productId);
    void insertMoney(double amount);
    void dispense();
    void cancel();
}

class VendingMachine {
    private VendingState currentState;

    public void selectProduct(String productId) {
        // TODO: delegate to current state
    }

    public void insertMoney(double amount) {
        // TODO: delegate to current state
    }

    public void dispenseProduct() {
        // TODO: dispense selected product
    }

    public void cancelTransaction() {
        // TODO: refund and reset state
    }
}`,
    domainValidationRules: {
      keywords: ['product', 'item', 'slot', 'inventory', 'state', 'payment', 'money', 'coin', 'dispense'],
      suggestedConceptsMessage:
        'Consider whether product inventory, coin/payment handling, and machine operational states are represented.',
      behaviors: [
        {
          name: 'Inventory / Product Selection',
          check: classes => {
            const names = classes.map(c => c.name.toLowerCase());
            const allMethods = classes.flatMap(c => c.methods).map(m => m.toLowerCase());
            return (
              names.some(n => n.includes('product') || n.includes('item') || n.includes('slot') || n.includes('inventory')) ||
              allMethods.some(m => m.includes('select') || m.includes('dispense') || m.includes('product') || m.includes('item'))
            );
          },
          hint: 'Modeling products/slots or selection methods demonstrates inventory management.',
        },
        {
          name: 'State Management / Payment Handling',
          check: classes => {
            const names = classes.map(c => c.name.toLowerCase());
            const allMethods = classes.flatMap(c => c.methods).map(m => m.toLowerCase());
            return (
              names.some(n => n.includes('state') || n.includes('payment') || n.includes('coin') || n.includes('money')) ||
              allMethods.some(m => m.includes('pay') || m.includes('insert') || m.includes('refund') || m.includes('cancel'))
            );
          },
          hint: 'Recognizing payment processing or machine states (e.g., Idle, HasMoney, Dispensing) enhances behavioral clarity.',
        },
      ],
    },
  },

  'elevator-system': {
    key: 'elevator-system',
    title: 'Elevator System',
    classExamples: [
      {
        name: 'ElevatorSystem',
        type: 'Class',
        responsibility: 'Manage elevators and coordinate requests across the building.',
        attributes: [
          'elevators : List<Elevator>',
        ],
        methods: [
          'requestElevator(floor : int, direction : Direction) : Elevator',
          'assignRequest(request : Request) : void',
        ],
      },
      {
        name: 'Elevator',
        type: 'Class',
        responsibility: 'Represent an elevator and manage its movement and current state.',
        attributes: [
          'elevatorId : int',
          'currentFloor : int',
          'direction : Direction',
          'state : ElevatorState',
        ],
        methods: [
          'moveToFloor(floor : int) : void',
          'openDoor() : void',
          'closeDoor() : void',
          'getCurrentFloor() : int',
        ],
      },
      {
        name: 'Floor',
        type: 'Class',
        responsibility: 'Represent a building floor and provide elevator request controls.',
        attributes: [
          'floorNumber : int',
        ],
        methods: [
          'pressUpButton() : void',
          'pressDownButton() : void',
        ],
      },
      {
        name: 'Request',
        type: 'Class',
        responsibility: 'Represent a request for elevator service from a floor or destination.',
        attributes: [
          'sourceFloor : int',
          'destinationFloor : int',
          'direction : Direction',
        ],
        methods: [
          'createRequest(source : int, destination : int) : Request',
        ],
      },
      {
        name: 'Door',
        type: 'Class',
        responsibility: 'Manage elevator door opening and closing behavior.',
        attributes: [
          'isOpen : boolean',
        ],
        methods: [
          'open() : void',
          'close() : void',
        ],
      },
      {
        name: 'ElevatorController',
        type: 'Class',
        responsibility: 'Assign elevator requests and coordinate elevator movement.',
        attributes: [],
        methods: [],
      },
    ],
    relationshipExamples: [
      {
        sourceClass: 'ElevatorSystem',
        targetClass: 'Elevator',
        relationship: 'COMPOSITION',
        relationshipLabel: 'Composition',
        reason: 'ElevatorSystem coordinates and manages the fleet of elevator cars.',
      },
      {
        sourceClass: 'ElevatorSystem',
        targetClass: 'Request',
        relationship: 'ASSOCIATION',
        relationshipLabel: 'Association',
        reason: 'ElevatorSystem receives floor and passenger service requests.',
      },
      {
        sourceClass: 'Elevator',
        targetClass: 'Door',
        relationship: 'COMPOSITION',
        relationshipLabel: 'Composition',
        reason: 'Elevator car owns its physical safety door mechanism.',
      },
      {
        sourceClass: 'Elevator',
        targetClass: 'Request',
        relationship: 'ASSOCIATION',
        relationshipLabel: 'Association',
        reason: 'Elevator serves assigned destination and hall requests.',
      },
      {
        sourceClass: 'Floor',
        targetClass: 'Request',
        relationship: 'ASSOCIATION',
        relationshipLabel: 'Association',
        reason: 'Floor hall buttons generate up/down requests.',
      },
      {
        sourceClass: 'ElevatorController',
        targetClass: 'Elevator',
        relationship: 'ASSOCIATION',
        relationshipLabel: 'Association',
        reason: 'ElevatorController schedules and dispatches cars using algorithms.',
      },
    ],
    explanationPrompts: {
      reasoning: {
        question: 'Why did you choose these classes?',
        guidance: 'Explain how your classes divide elevator movement, requests, floors, doors, and controller responsibilities.',
        placeholder: 'Explain how your classes divide elevator movement, requests, floors, doors, and controller responsibilities.',
      },
      assumptions: {
        question: 'What assumptions did you make?',
        guidance: 'Explain assumptions about floors, elevators, requests, direction, capacity, and scheduling.',
        placeholder: 'Explain assumptions about floors, elevators, requests, direction, capacity, and scheduling.',
      },
      tradeOffs: {
        question: 'What alternatives did you consider?',
        guidance: 'Explain alternatives considered for elevator assignment and request scheduling.',
        placeholder: 'Explain alternatives considered for elevator assignment and request scheduling.',
      },
      extensibility: {
        question: 'How can your design handle future changes?',
        guidance: 'Explain how the design can support more elevators, scheduling strategies, emergency modes, and new request types.',
        placeholder: 'Explain how the design can support more elevators, scheduling strategies, emergency modes, and new request types.',
      },
      patternsUsed: {
        question: 'Which design patterns did you use and why?',
        guidance: 'Explain whether State, Strategy, Observer, or another pattern is useful and why.',
        placeholder: 'Explain whether State, Strategy, Observer, or another pattern is useful and why.',
      },
    },
    codeStarter: `class Elevator {
    private int elevatorId;
    private int currentFloor;

    public void moveToFloor(int floor) {
        // TODO: implement movement
    }

    public void openDoor() {
        // TODO: open elevator door
    }

    public void closeDoor() {
        // TODO: close elevator door
    }
}

class ElevatorSystem {
    private List<Elevator> elevators;

    public void assignRequest(Request request) {
        // TODO: select appropriate elevator
    }
}`,
    domainValidationRules: {
      keywords: ['elevator', 'car', 'floor', 'request', 'door', 'controller', 'dispatch', 'schedule'],
      suggestedConceptsMessage:
        'Consider whether elevator cabins, floor hall requests, and dispatching/controller behavior are represented.',
      behaviors: [
        {
          name: 'Elevator Cabin / Movement',
          check: classes => {
            const names = classes.map(c => c.name.toLowerCase());
            const allMethods = classes.flatMap(c => c.methods).map(m => m.toLowerCase());
            return (
              names.some(n => n.includes('elevator') || n.includes('car') || n.includes('lift')) ||
              allMethods.some(m => m.includes('move') || m.includes('floor') || m.includes('door') || m.includes('step'))
            );
          },
          hint: 'Modeling the elevator car and its floor movement methods ensures cabin kinematics are represented.',
        },
        {
          name: 'Request Dispatching / Scheduling',
          check: classes => {
            const names = classes.map(c => c.name.toLowerCase());
            const allMethods = classes.flatMap(c => c.methods).map(m => m.toLowerCase());
            return (
              names.some(n => n.includes('request') || n.includes('controller') || n.includes('system') || n.includes('dispatcher') || n.includes('button')) ||
              allMethods.some(m => m.includes('request') || m.includes('assign') || m.includes('dispatch') || m.includes('call') || m.includes('press'))
            );
          },
          hint: 'Modeling service requests or dispatch controllers demonstrates multi-car scheduling coordination.',
        },
      ],
    },
  },
};

/**
 * Helper to resolve ProblemConfig by problem slug or problem ID
 */
export function getProblemConfig(problem?: Problem | null): ProblemConfig {
  if (!problem) {
    return PROBLEM_CONFIGS['parking-lot'];
  }

  const slug = (problem.slug || '').toLowerCase();
  const id = (problem.id || '').toLowerCase();

  if (slug.includes('vending') || id.includes('vending')) {
    return PROBLEM_CONFIGS['vending-machine'];
  }
  if (slug.includes('elevator') || id.includes('elevator')) {
    return PROBLEM_CONFIGS['elevator-system'];
  }
  return PROBLEM_CONFIGS['parking-lot'];
}
