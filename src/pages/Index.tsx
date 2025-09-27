import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);

  const audioTracks = [
    { title: 'Настрой на здоровье', duration: '15:30', category: 'Здоровье' },
    { title: 'Гармония и покой', duration: '12:45', category: 'Медитация' },
    { title: 'Энергия жизни', duration: '18:20', category: 'Энергия' },
    { title: 'Исцеление души', duration: '20:15', category: 'Исцеление' }
  ];

  const services = [
    {
      icon: 'Heart',
      title: 'Лечебные настрои',
      description: 'Персональные аудио-настрои для исцеления различных недугов и восстановления энергетического баланса',
      features: ['Индивидуальный подход', 'Проверенные техники', 'Долгосрочный эффект']
    },
    {
      icon: 'PenTool',
      title: 'Создание текстов',
      description: 'Профессиональные тексты для социальных сетей, мероприятий, поздравлений и любых жизненных событий',
      features: ['Уникальный стиль', 'Быстрое исполнение', 'Любая тематика']
    },
    {
      icon: 'BookOpen',
      title: 'Стихи и сценарии',
      description: 'Авторские стихотворения и сценарии для праздников, торжеств и особых моментов вашей жизни',
      features: ['Эмоциональность', 'Оригинальность', 'Запоминаемость']
    }
  ];

  const testimonials = [
    {
      name: 'Анна Петрова',
      text: 'Настрои помогли мне справиться с тревожностью. Уже через неделю почувствовала значительное улучшение.',
      rating: 5
    },
    {
      name: 'Михаил Соколов',
      text: 'Отличные тексты для корпоративного мероприятия! Все гости были в восторге от сценария.',
      rating: 5
    },
    {
      name: 'Елена Кузнецова',
      text: 'Персональный настрой на здоровье превзошел все ожидания. Рекомендую всем!',
      rating: 5
    }
  ];

  const togglePlayback = (trackIndex: number) => {
    if (currentTrack === trackIndex && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentTrack(trackIndex);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-500 to-green-400 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Исцеление через
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-green-200">
                  слово и звук
                </span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Лечебные настрои для здоровья и гармонии. Создание текстов любой сложности 
                для всех сфер жизни. Погрузитесь в мир исцеляющих вибраций.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-blue-50">
                  <Icon name="Play" className="mr-2" size={20} />
                  Начать прослушивание
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  <Icon name="MessageCircle" className="mr-2" size={20} />
                  Заказать текст
                </Button>
              </div>
            </div>
            <div className="animate-scale-in">
              <img 
                src="/img/0665a442-31f6-4988-8125-236bff7c2ee5.jpg" 
                alt="Zen garden with meditation stones" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Audio Player Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Библиотека настроев</h2>
            <p className="text-xl text-gray-600">Выберите настрой для прослушивания</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {audioTracks.map((track, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {track.category}
                    </Badge>
                    <span className="text-sm text-gray-500">{track.duration}</span>
                  </div>
                  <CardTitle className="text-lg">{track.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => togglePlayback(index)}
                    className="w-full"
                    variant={currentTrack === index && isPlaying ? "secondary" : "default"}
                  >
                    <Icon 
                      name={currentTrack === index && isPlaying ? "Pause" : "Play"} 
                      className="mr-2" 
                      size={16} 
                    />
                    {currentTrack === index && isPlaying ? 'Пауза' : 'Воспроизвести'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Наши услуги</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Комплексный подход к исцелению и творчеству для гармонии в жизни
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300 animate-fade-in">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-green-400 rounded-full flex items-center justify-center mb-4">
                    <Icon name={service.icon} size={32} className="text-white" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center justify-center text-sm text-gray-600">
                        <Icon name="Check" size={16} className="text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">Узнать подробнее</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Отзывы клиентов</h2>
            <p className="text-xl text-gray-600">Истории исцеления и трансформации</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Icon key={i} name="Star" size={20} className="text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-gray-900">— {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-green-400 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Начните свой путь к исцелению</h2>
          <p className="text-xl mb-8 text-blue-100">
            Получите персональную консультацию и узнайте, какие настрои подойдут именно вам
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-blue-50">
              <Icon name="Phone" className="mr-2" size={20} />
              Записаться на консультацию
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              <Icon name="Mail" className="mr-2" size={20} />
              Написать письмо
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Контакты</h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center">
                  <Icon name="Phone" size={16} className="mr-3" />
                  <span>+7 (999) 123-45-67</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Mail" size={16} className="mr-3" />
                  <span>info@healing-texts.ru</span>
                </div>
                <div className="flex items-center">
                  <Icon name="MapPin" size={16} className="mr-3" />
                  <span>Москва, онлайн консультации</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Услуги</h3>
              <ul className="space-y-2 text-gray-300">
                <li>Лечебные настрои</li>
                <li>Создание текстов</li>
                <li>Стихи и поздравления</li>
                <li>Сценарии мероприятий</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Информация</h3>
              <ul className="space-y-2 text-gray-300">
                <li>О методике</li>
                <li>Примеры работ</li>
                <li>Статьи и советы</li>
                <li>Часто задаваемые вопросы</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Социальные сети</h3>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <Icon name="Instagram" size={20} />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <Icon name="MessageCircle" size={20} />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <Icon name="Youtube" size={20} />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Исцеляющие тексты и настрои. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;