# me-api [![Build Status](https://travis-ci.com/gurrabergh/jsramverk-tradingapi.svg?branch=main)](https://travis-ci.com/gurrabergh/jsramverk-tradingapi)[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/gurrabergh/jsramverk-tradingapi/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/gurrabergh/jsramverk-tradingapi/?branch=main)[![Build Status](https://scrutinizer-ci.com/g/gurrabergh/jsramverk-tradingapi/badges/build.png?b=main)](https://scrutinizer-ci.com/g/gurrabergh/jsramverk-tradingapi/build-status/main)[![Code Coverage](https://scrutinizer-ci.com/g/gurrabergh/jsramverk-tradingapi/badges/coverage.png?b=main)](https://scrutinizer-ci.com/g/gurrabergh/jsramverk-tradingapi/?branch=main)

# Val av teknik

Jag valde att fortsätta att jobba med samma tekniker som jag gjorde med me-sidan. JavaScript, Express samt MongoDB. Jag skippade sqlite då jag snabbt insåg att jag kunde lägra allt jag behövde i mongodb, "object"-formatet passade utmärkt för att lagra inloggnignsuppgifter, saldo samt lista på aktier i samma. Jag valde även att fortsätta att autentisera användare via JSON Web Tokens samt att implementera realtidsaspekten med socket.io då jag insåg hur mycket kod jag kunde återanvända. 

### Realtid

I backenden så består realtidsaspekten utav socket.io och en funktion som slumpar fram priset på aktierna. Jag modifierade koden från 'simulate-prices' för att det skulle passa projektets syfte.
Jag tycker socket fungerar extremt bra och det var lätt för mig att sätta mig in i det från början. Man fixar det man behöver med väldigt lite kod. Simpelt men effektivt. Då det är så lite kod som krävdes för att få den funktionalitet jag behövde så valde jag att lägga realtids-microservicen i samma API som backended för övriga sidan.

### Tester

Verktygen jag använt mig av för testning är Mocha, NYC och chai. Till en början så täcktes alla mina routes av testerna, endast funktionerna för realtid och för att slumpa fram aktiepriserna täcktes inte. Det var dock ett av testerna som testade funktionen för att logga in med ett giltigt konto som inte fungerade i Travis CI så jag skippade det. Jag lyckades ändå uppnå en täckning på ca 80% lokalt och i Travis. Täckningen via Scrutinizer är ca 63% för att några tester inte fungerade där. Jag är väldigt nöjd över hur mitt teknikval fungerade lokalt men det var lite klurigt i byggtjänsterna. Jag uppskattar feedbacken man från av Travis och Scrutinizer, speciellt kodfeedbacken. Det är dock irriterande hur testerna skiljer sig mellan lokalt, Travis och Scrutinizer och man får tyvärr inga felmeddelanden som hjälper. Med lite mer tid så hade jag säkert kunnat få det att fungera. 

Tjänsten för kodkvalitet gav mig 10/10 så det är jag absolut nöjd med. Betyget för kodtäckning på 63% känns okej men vet att jag har närmare 80% lokalt så det känns ändå bra.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm start
```

### Compiles and minifies for production
```
npm run production
```
