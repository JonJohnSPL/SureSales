export const STAGES = [
  "Qualification","Relationship Build","Internal Alignment","Needs Dates",
  "Execution Prep","Quoted","Awaiting Response","Recovery","On Hold",
  "Won / Active","Lost / Closed",
];
export const PRIORITIES = ["High","Medium","Low"];
export const HEALTHS = ["Green","Yellow","Red"];
export const OWNERS = [
  "Glen Grossi","Jonathan John","Seph Farabaugh","Andy Hartman",
  "Ryleigh Jacobs","Justin Stewart","Dakota Moore","Trenton Sweet","Unassigned",
];
export const STATUSES = [
  "Open","In Progress","Waiting on Customer","Waiting on Internal","Scheduled","Closed",
];

export const SEED_PROJECTS = [
  { id:"P-001", client:"MPLX", workstream:"Proving — need dates and locations", bucket:"Current", duration:"2 weeks +", ask:"Get proving dates and locations", owner:"Glen Grossi", priority:"High", stage:"Needs Dates", status:"Open", health:"Yellow", nextStep:"Confirm site list + window with Matt Jones", dueDate:"2026-06-30", hardDate:false, recurring:true, notes:"Seph asked for an owner per item and recurring sit-downs to lock hard dates." },
  { id:"P-002", client:"MPLX", workstream:"75% embedded gas technician", bucket:"New", duration:"3 weeks", ask:"Need start date and expectations", owner:"Glen Grossi", priority:"High", stage:"Qualification", status:"Open", health:"Yellow", nextStep:"Define scope + start date with MPLX", dueDate:"2026-07-03", hardDate:false, recurring:true, notes:"Track startup requirements and expectation-setting." },
  { id:"P-003", client:"EOG", workstream:"Truck LACT proving", bucket:"Current", duration:"3 days", ask:"Need July dates", owner:"Glen Grossi", priority:"High", stage:"Needs Dates", status:"Open", health:"Yellow", nextStep:"Confirm July window", dueDate:"2026-06-27", hardDate:false, recurring:false, notes:"July dates needed." },
  { id:"P-004", client:"EOG", workstream:"Allocation proving", bucket:"Current", duration:"3 weeks", ask:"Need restart date", owner:"Glen Grossi", priority:"High", stage:"Recovery", status:"Open", health:"Red", nextStep:"Push for restart commitment", dueDate:"2026-06-30", hardDate:false, recurring:false, notes:"Previously had this work; restart needed ASAP." },
  { id:"P-005", client:"EOG", workstream:"Lab work — heavy gas + 2103 samples", bucket:"Current", duration:"", ask:"Address sample drop and recover volume", owner:"Glen Grossi", priority:"High", stage:"Recovery", status:"Open", health:"Red", nextStep:"Diagnose drop in 2103 sample flow", dueDate:"2026-07-08", hardDate:false, recurring:true, notes:"Heavy gas + 2103 samples dropped this month." },
  { id:"P-006", client:"Gulfport", workstream:"Embedded measurement", bucket:"Current", duration:"2–3 weeks", ask:"Train Trent while Austin runs the work", owner:"Glen Grossi", priority:"Medium", stage:"Execution Prep", status:"In Progress", health:"Yellow", nextStep:"Build Trent training schedule", dueDate:"2026-07-15", hardDate:false, recurring:false, notes:"No external action — internal training only." },
  { id:"P-007", client:"Gulfport", workstream:"Embedded automation", bucket:"New", duration:"2–4 weeks", ask:"Seph / JJ / Glen circle up on pricing options (travel vs local)", owner:"Jonathan John", priority:"High", stage:"Internal Alignment", status:"Waiting on Internal", health:"Yellow", nextStep:"Hold internal pricing call", dueDate:"2026-06-30", hardDate:false, recurring:false, notes:"Travel vs local pricing models." },
  { id:"P-008", client:"Antero", workstream:"Liquid sampling project", bucket:"New", duration:"2–3 days/mo", ask:"Need start dates ASAP", owner:"Glen Grossi", priority:"High", stage:"Needs Dates", status:"Open", health:"Yellow", nextStep:"Lock monthly cadence + first date", dueDate:"2026-07-01", hardDate:false, recurring:true, notes:"Recurring monthly effort." },
  { id:"P-009", client:"Antero", workstream:"'Shop' proving", bucket:"Current", duration:"2 weeks / yr", ask:"Continue comms; likely need CO support and dates", owner:"Glen Grossi", priority:"Medium", stage:"Qualification", status:"Open", health:"Yellow", nextStep:"Confirm CO support availability", dueDate:"2026-07-15", hardDate:false, recurring:false, notes:"Annual effort not counted in monthly total." },
  { id:"P-010", client:"MPC", workstream:"Witnessing", bucket:"Current", duration:"1 week", ask:"Continue building local relationship", owner:"Glen Grossi", priority:"Medium", stage:"Relationship Build", status:"Open", health:"Yellow", nextStep:"Schedule local touchpoint", dueDate:"2026-07-10", hardDate:false, recurring:true, notes:"Nurture local relationship." },
];

export const SEED_TARGETS = [
  { client:"EQT Corporation", nextMove:"Executive intro → procurement meeting", wedge:"Gas comp + lab", status:"Not started · top priority", type:"Prospect" },
  { client:"Expand Energy", nextMove:"Reconnect after postponed meeting", wedge:"Proving + sampling", status:"In progress — ~$600K upside", type:"Prospect" },
  { client:"Antero Resources", nextMove:"Follow up on two open quotes", wedge:"Proving + gas meas.", status:"2 quotes submitted", type:"Prospect" },
  { client:"Range Resources", nextMove:"Cold call → intro meeting", wedge:"Gas comp + lab", status:"Not started", type:"Prospect" },
  { client:"CNX Resources", nextMove:"Cold call → measurement leader", wedge:"Gas comp + lab", status:"Not started", type:"Prospect" },
  { client:"MPLX", nextMove:"Finalize proving with Matt Jones", wedge:"Liquid proving", status:"Near-final approval", type:"Current Client" },
  { client:"Gulfport", nextMove:"Expand embedded I&E tech discussion", wedge:"Meas. + I&E", status:"Verbal discussion on I&E tech", type:"Current Client" },
  { client:"EOG", nextMove:"Follow up: VRU + grindouts", wedge:"Lab + liquid", status:"Awaiting response — regain lost work", type:"Current Client" },
  { client:"Coterra Energy", nextMove:"Research + cold call", wedge:"Gas / liquid", status:"Not started", type:"Prospect" },
  { client:"Ascent Resources", nextMove:"Research + cold call", wedge:"Gas meas.", status:"Not started", type:"Prospect" },
];

export const FUNNEL_ROWS = [
  { stage:"1. Total addressable", producers:22, midstream:16, note:"~38 entities total addressable market." },
  { stage:"2. Has work for us", producers:22, midstream:16, note:"Doc table; slide deck gives a 30–35 workable estimate." },
  { stage:"3. Talked to", producers:13, midstream:10, note:"From market analysis doc." },
  { stage:"4. Quoted", producers:6, midstream:6, note:"From market analysis doc." },
  { stage:"5. Awaiting response", producers:null, midstream:null, note:"Slide estimates ~3–4 awaiting response." },
  { stage:"6. Current customers", producers:null, midstream:null, totalOverride:5, note:"EOG, MPLX, Gulfport, Williams, Grenadier." },
];
