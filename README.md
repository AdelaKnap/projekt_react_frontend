# DT210G Projket React
I den här uppgiften har en webbplats skapats med React och Type Script som hämtar böcker från Google Books API och sedan hanterar recensioner i ett externt API.
Webbplatsen består av en startsida, en sida för att visa enksild bok med mer information samt recensioner knutna till den aktuella boken, en sida för att hantera inloggad användares recensioner, en sida för att lägga till ny recension, en inloggningssida samt en sida för att skapa ny användare.
Alla sidor förutom startsidan samt sidan med detaljerad information är skyddade och kräver inloggning.

## Uppbyggnad
För att hantera autentisering används filen AuthContext med funktioner för att logga in, logga ut och kontrollera användarsessioner. AuthContext anävnds för att dela användarens autentiseringsinformationen mellan komponenter och där finns en Hook, useAuth-hook, för att få tillgång till dessa funktioner i hela applikationen.

På startsidan används komponenten BookList där visas böcker som hämtas från ett API där böcker från genren mysterier hämtas som default. Användaren kan filtrera efter genre samt söka efter böcker där resultaten filtreras dynamsikt. Användaren kan klicka sig vidare på en bok, och kommer då till en sida med information om bara den boken samt alla recensioner knutna till boken som hämtas från servern och som hanteras i komponenten ReviewList. Här finns även möjlighet att lägga till en ny recension, i ett formulär som valideras med Yup, för inloggade användare där ett POST-anrop då görs till servern. På startsidan finns även paginering.

På inloggningssida kan användaren logga in med användarnamn och lösenord. Om användaren redan är inloggad skickas man automatiskt till sidan "Mina recensioner" och samma upplägg vid lyckad inloggning. Det finns också en länk för att skapa ett nytt användarkonto.

På sidan "Mina recensioner" hämtas alla recensioner från servern, som finns knutna till den inloggade användaren, och lagras i en state. Det finns funktioner för att redigera och radera recensioner där validering sker med YUP. Två komponenter används här:

Utöver dessa komponenter finns även komponeter för header, footer och en komponent som sköter den skyddade sidan.

## Skapad av:
Adela Knap adkn2300@student.miun.se