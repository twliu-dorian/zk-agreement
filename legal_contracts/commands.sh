# generate a sample instance of the PurchaseOrder concept
concerto generate sample --model model/purchaseorder.cto --concept org.accordproject.purchaseorder.PurchaseOrder

# validate a request.json against the PurchaseOrder model
concerto validate --input request-purchase.json --model model/purchaseorder.cto --concept org.accordproject.purchaseorder.PurchaseOrder
concerto validate --input request-purchase.json --concept org.accordproject.purchaseorder.PurchaseOrder

# cicero commands
cicero trigger --template supplyagreement --sample supplyagreement/text/sample.md --request supplyagreement/request-forecast.json --state supplyagreement/state.json
cicero trigger --template supplyagreement --sample supplyagreement/text/sample.md --request supplyagreement/request-purchase.json --state supplyagreement/state.json
