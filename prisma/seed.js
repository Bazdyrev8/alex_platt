const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function Categories() {
    const createMany = await prisma.categories.createMany({
        data: [
            { title: "Падший" },
            { title: "Доктор Хаос" },
            { title: "Кок"},
            { title: "Айс"}
        ],
        skipDuplicates: true
        }
    );
}

async function Items() {
    const createMany = await prisma.items.createMany({
        data: [
            { 
                title: "Падший 1",
                image: "Padshiy1.jpg",
                categ_id: Number(1),
                description: "Я ничего не помню о своем прошлом и понятия не имею, как попал в это место. Все, что у меня есть - это прозвища. Сначала - Одиннадцатый, потом - Падший, и оба мне ни о чем не говорят. Все, что я знаю - мне нужно выжить в испытании девяти этажей. И это, похоже, будет непросто..."
            },
            { 
                title: "Падший 2",
                image: "Padshiy2.png",
                categ_id: Number(1),
                description: "Цель казалась близка, осталась всего пара - тройка этажей. Рядом верные друзья, а сам стал сильнее и многому научился. Вот только кто же знал, что восхождение по этажам - лишь разминка перед настоящим испытанием?"
            },
            { 
                title: "Падший 3",
                image: "Padshiy3.png",
                categ_id: Number(1),
                description:"История Падшего продолжается. Предательство не сделало его слабее, а только вынудило исчезнуть на время. Но не отменило миссии по спасению друзей. Как всегда, действительность имела свои планы. Если Падший хочет выжить, то придется принять предложение Следящих."
            },
            { 
                title: "Доктор Хаос 1",
                image: "Doctor_Haos1.jpg",
                categ_id: Number(2),
                description:'Спасение из горящего самолета окончилось... неожиданно. Теперь ты - попаданец и салватор с классом Расследователь и должен найти причину появления странного вируса, не смертельного, но опасного. Из инструментов для решения этой задачи у тебя есть лишь лупа, скальпель и термос с кофе. А еще твоей смерти хотят мятежники, ведьмы и прочая нечисть. "Добро пожаловать", Доктор Хаос!'
            },
            { 
                title: "Падший 4",
                image: "Padshiy4.jpg",
                categ_id: Number(1),
                description:'Что делать, если ты узнал, кто ты такой? Когда у тебя наконец появилось имя, данное при рождение, станет ли тебе легче? Падший вернул память, но помогут ли эти знания, он без понятия. А еще на дворе 40 год до н.э., но никто не отменял неспокойную жизнь.'
            },
            { 
                title: "Доктор Хаос 2",
                image: "Doctor_Haos2.jpg",
                categ_id: Number(2),
                description:'С ведьмами покончено? Нет. Мятежники схвачены? Вряд ли все. И ведь это еще не все проблемы, а только основные. Хаос так думал, пока не влез в проблемы мира Викания поглубже. Неизведанные территории, первое понимание Диаса и многое, многое другое, что так и не даст ему пока насладиться покоем, тишиной и благодатью. Одно хорошо, он пока еще жив.'
            },
            { 
                title: "Кок",
                image: "Kok.jpg",
                categ_id: Number(3),
                description:'Рулетка шанса дает надежду на выживание тому, кто приговорен к смерти. Выпадет зеро - и казнь не состоится, а преступник получит шанс на новую жизнь... В другом мире и в чужом теле.Так на месте кухонного служки, труса и слабака, однажды окажется асассин - без памяти о прошлом и лишенный каких бы то ни было знаний о новом мире.А калейдоскоп событий уже делает первый оборот. Бескрайнее море, жители множества островов и не менее многочисленные пираты готовы встретить нового Спасителя... и убить его при первой же возможности.'
            },
            { 
                title: "Доктор Хаос 3",
                image: "Doctor_Haos3.jpg",
                categ_id: Number(2),
                description:'Все вновь перевернулось с ног на голову. Был врагом Лековритании, появился шанс стать героем королевства. Попал в очередной данж личный, Хьюстон... тьфу ты, Хаос обрел новые проблемы. О предательстве и думать не хочется, плюс надо как-то попасть в обитель холода и гор, знать бы еще как это сделать.'
            },
            { 
                title: "Айс",
                image: "Ays.jpg",
                categ_id: Number(4),
                description:'Как же хорошо жить за городом: свежий воздух, тишина, летом цветы радуют своими запахами и красотой. Зимой, в принципе, тоже неплохо, есть свой шарм. Но не тогда, когда долго идёт сильнейший снегопад. Он был не первый на моем веку, но вот после именно этого многое изменилось в моей жизни. Появились новые правила: хочешь жить - научись выживать. Хочешь дышать - начни убивать. Главное, не потеряй свою душу. Вот так.'
            },
        ],
        skipDuplicates: true
        }
    );
}

async function UserAdmin() {
    const createMany = await prisma.users.createMany({
        data: [
            { username: "A" ,
              password: "A", 
              type: "A" }
        ],
        skipDuplicates: true
        }
    );
}

Categories()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.log(e);
        await prisma.$disconnect();
        process.exit(1); 
    })

Items()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.log(e);
        await prisma.$disconnect();
        process.exit(1); 
    })

UserAdmin()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.log(e);
        await prisma.$disconnect();
        process.exit(1); 
    })